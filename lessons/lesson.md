---
marp: true
theme: default
paginate: true
---

# Урок: Глобальное состояние, React Query и Работа с API
**Что мы сегодня изучим?**
1. Как хранить данные пользователя для всего приложения (React Context).
2. Зачем нам `React Query` и как он делает запросы проще.
3. Как правильно организовывать запросы к API (Service Pattern).
4. Как создавать формы и управлять состоянием страницы.

---

# Проблема 1: Как передать данные? (Prop Drilling)
Представьте, что мы получили данные пользователя в самом начале приложения (`App`), но они нужны глубоко внутри: например, в `Avatar` внутри `Header`. 

Без специальных инструментов нам пришлось бы передавать `user` через **каждый** промежуточный компонент:
```tsx
<App user={user}>
  <Layout user={user}>
    <Header user={user}>
      <UserAvatar user={user} />
    </Header>
  </Layout>
</App>
```
Это называется **Prop Drilling**. Это делает код грязным и сложным в поддержке.

---

# Решение: React Context
React Context создает "глобальное хранилище". Мы кладем данные в "Провайдер" на самом верхнем уровне, и **любой** компонент внутри может достать эти данные напрямую!

```tsx
// Где-то высоко в приложении:
<AuthProvider>
  <Layout>
    <Header>
      <UserAvatar /> {/* Берет данные напрямую из AuthProvider! */}
    </Header>
  </Layout>
</AuthProvider>
```
Именно так мы будем хранить данные о текущем авторизованном пользователе и его токене.

---

# Почему React Query (@tanstack/react-query)?
Раньше для запросов использовали `useEffect` + `useState` (загрузка, ошибка, данные). Это было сложно и требовало много кода.

**React Query дает нам суперсилы из коробки:**
1. **Кеширование**: Сделали запрос один раз, второй раз данные берутся моментально из кеша.
2. **Статусы**: Автоматически дает нам переменные `isLoading`, `isError`, `data`.
3. **Обновление**: Можно легко сказать "Обнови список", и таблица перерисуется.

Мы используем:
- `useQuery` - для **получения** данных (GET).
- `useMutation` - для **изменения** данных (POST, PATCH, DELETE).

---

# Архитектура: Разделение логики (Services)
Мы не пишем API-запросы прямо внутри компонентов React. Почему?
1. Компоненты разрастаются и становятся непонятными.
2. Одни и те же запросы могут понадобиться в разных местах.

**Решение:**
Мы выносим запросы в отдельные файлы — **Сервисы**. 
Например: `projectService.ts` отвечает ТОЛЬКО за запросы, связанные с проектами. Контейнер страницы только вызывает готовые функции.

---

# Шаг 1: Типы данных (TypeScript)
Прежде чем получать данные, нужно описать, как они выглядят.
**📄 `src/types/user.ts`**

```tsx
export interface User {
    id: string
    username: string;
    // null — означает, что поле может быть пустым (например, пользователь не указал имя)
    firstName: string | null; 
    lastName: string | null;
    email: string
}
```
**Зачем?** TypeScript проверит, что мы не пытаемся использовать несуществующие поля и подскажет автодополнением в редакторе.

---

# Шаг 2: Создаем AuthContext (Интерфейс)
**📄 `src/contexts/AuthContext.tsx`**

```tsx
import { createContext, useContext, ReactNode, FC } from "react";
// ...импорты опущены для краткости

// 1. Описываем, что будет лежать в нашем контексте
interface AuthContextProps {
  user: User | null;       // Данные пользователя
  isLoading: boolean;      // Идет ли загрузка
  isError: boolean;        // Есть ли ошибка
  logout: () => void;      // Функция для выхода из аккаунта
  refetchUser: () => void; // Функция для повторного запроса профиля
}

// 2. Создаем сам контекст (пустой по умолчанию)
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
```

---

# Шаг 3: Создаем AuthProvider (Провайдер)
**📄 `src/contexts/AuthContext.tsx`**

```tsx
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenStorage.deleteValue();     // Удаляем токен из браузера
    userStorage.deleteValue();      // Удаляем пользователя
    apiService.deleteBearerToken(); // Удаляем из заголовков запроса
    queryClient.clear();            // Чистим кеш react-query
    navigate({ to: "/auth" });      // Перебрасываем на логин
  };

  // ... (useQuery здесь, см. следующий слайд)
```

---

# Шаг 4: Загрузка профиля в провайдере
**📄 `src/contexts/AuthContext.tsx`**

```tsx
  // Загружаем профиль пользователя (сработает сразу при загрузке страницы)
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["auth", "profile"], // Имя в кеше
    queryFn: async () => {
      // Если токена нет - кидаем ошибку
      if (!tokenStorage.hasValue()) throw new Error("No token");
      
      // Добавляем токен к запросам
      apiService.saveBearerToken(tokenStorage.getValue());
      try {
        const res = await apiService.get<User>({ url: "/v1/auth/my" });
        if (res.statusCode >= 400 || !res.data) throw new Error("Error");
        
        userStorage.setValue(res.data);
        return res.data;
      } catch (err) {
        handleLogout(); // Если токен протух - разлогиниваем
        throw err;
      }
    },
    enabled: tokenStorage.hasValue(), // Делаем запрос ТОЛЬКО если есть токен
  });
```

---

# Шаг 5: Запуск Провайдера и Хук
**📄 `src/contexts/AuthContext.tsx`**

```tsx
  return (
    // Оборачиваем дочерние элементы и передаем value
    <AuthContext.Provider value={{ user: user || null, isLoading, isError, logout: handleLogout, refetchUser: refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Создаем удобный хук, чтобы не писать useContext каждый раз
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Если forgot обернуть приложение в AuthProvider — подскажем об этом
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

---

# Шаг 6: Подключение и использование
**📄 `src/routes/__root.tsx`** - Оборачиваем все приложение!
```tsx
  return (
    <AuthProvider> {/* Теперь useAuth() работает везде внутри! */}
      <ToastProvider>
        {!isAuthRoute && <Header /> }
        <Outlet />
      </ToastProvider>
    </AuthProvider>
  )
```

**📄 `src/components/Header.tsx`** - Достаем данные пользователя:
```tsx
export const Header: FC = () => {
  // Просто вызываем наш хук! Магия!
  const { user, isLoading } = useAuth();

  return (
    // "?." используется чтобы не получить ошибку, если user еще загружается (null)
    <h3>{isLoading ? "Loading..." : user?.username || "Guest"}</h3>
  )
}
```

---

# Шаг 7: Сервис Проектов (projectService)
Выносим логику работы с проектами в отдельный файл.
**📄 `src/services/projectService.ts`**

```tsx
export interface CreateProjectDto { name: string; }
export interface Project { id: string; name: string; }

class ProjectService {
  async createProject(dto: CreateProjectDto) {
    const res = await apiService.post<Project>({ url: "/v1/projects", dto });
    return res.data;
  }
  async getProjects() {
    const res = await apiService.get<Project[]>({ url: "/v1/projects" });
    return res.data;
  }
}
export const projectService = new ProjectService();
```

---

# Шаг 8: Хуки для Проектов (React Query)
Там же, создаем хуки для получения и редактирования.
**📄 `src/services/projectService.ts`**

```tsx
// Хук ПОЛУЧЕНИЯ списка
export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });
};

// Хук СОЗДАНИЯ
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateProjectDto) => projectService.createProject(dto),
    onSuccess: () => {
      // КЛЮЧЕВОЙ МОМЕНТ: Говорим React Query "Список проектов устарел, скачай заново!"
      // Таким образом список обновится АВТОМАТИЧЕСКИ!
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
```

---

# Шаг 9: Страница Home (Отображение списков)
**📄 `src/pages/Home.tsx`**

```tsx
export const Home = () => {
  const { data: projects, isLoading } = useProjects();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid">
      {/* Рендерим массив данных в элементы React */}
      {projects?.map((project) => (
        <div key={project.id}> {/* key ОЧЕНЬ ВАЖЕН для производительности React! */}
          <h3>{project.name}</h3>
        </div>
      ))}
    </div>
  )
}
```

---

# Шаг 10: Форма и Модалка (React Hook Form)
**📄 `src/pages/Home.tsx`**

Чтобы не получать ошибку "Uncontrolled input", мы задаем `defaultValues`.
```tsx
const { control, handleSubmit, reset } = useForm<CreateProjectForm>({
  defaultValues: { name: "" }, // Начальное состояние обязательно!
});

const { mutate: createProject, isPending } = useCreateProject();

const onSubmit = (data: CreateProjectForm) => {
  // Вызываем нашу мутацию!
  createProject(data, {
    onSuccess: () => {
      reset();               // Очистить форму
      setIsModalOpen(false); // Закрыть модалку
    }
  });
};
```

---

# Итог работы интерфейса

1. Клиент открывает приложение -> `AuthContext` проверяет пользователя.
2. Открывается `Home` -> `useProjects` делает `GET /projects`.
3. Пользователь жмёт "New Project" -> Открывается `<CustomModal>`.
4. Вводит имя проекта -> Вызывается `useCreateProject.mutate()`.
5. Идет `POST /projects` -> Успех!
6. `invalidateQueries` заставляет `useProjects` сделать новый `GET` запрос.
7. Список проектов на экране автоматически обновляется.

**Все работает плавно, без ручной перезагрузки страницы, с сохранением всех данных и кешированием!**
