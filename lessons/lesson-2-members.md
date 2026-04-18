---
marp: true
theme: default
paginate: true
---

# Урок: Работа с участниками проекта
**Продолжение — Урок 2**

На прошлом уроке мы научились:
- Создавать проекты и показывать их списком
- Использовать `useQuery` и `useMutation`
- Строить формы через `react-hook-form`

**Сегодня мы научимся:**
1. Расширять существующий сервис новыми методами
2. Открывать вложенные модальные окна с привязкой к конкретному объекту
3. Делать локальный поиск по данным без лишних запросов к API

---

# Что нам дал бэкенд?
Сервер предоставляет три эндпоинта для работы с участниками:

| Метод | URL | Что делает |
|---|---|---|
| `GET` | `/api/v1/projects/:id/members` | Список текущих участников |
| `GET` | `/api/v1/projects/:id/participants` | Список тех, кого ещё можно добавить |
| `POST` | `/api/v1/projects/:id/members` | Добавить пользователя в проект |

Обрати внимание: все URL содержат `:id` проекта.
Это значит, что **данные уникальны для каждого проекта** — нельзя перепутать участников разных проектов.

---

# Шаг 1: Типы данных для участников
Создаём отдельный файл для типов.
**📄 `src/types/member.ts`**

```ts
// Роли в проекте (точь-в-точь как в базе данных на сервере)
export type ProjectRole = "ADMIN" | "WORKER";

// Участник проекта — ответ от GET /projects/:id/members
export interface ProjectMember {
  role: ProjectRole;
  user: {
    username: string;
    firstName: string | null;
    lastName: string | null;
  };
}

// Пользователь которого можно добавить — ответ от GET /projects/:id/participants
export interface ProjectParticipant {
  username: string;
  firstName: string | null;
  lastName: string | null;
}

// Что мы отправляем при добавлении — тело POST /projects/:id/members
export interface AddMemberDto {
  username: string;
}
```

---

# Шаг 2: Новые методы в projectService
Открой `src/services/projectService.ts` и добавь в класс `ProjectService`:

```ts
// Получить текущих участников проекта
async getMembers(projectId: string) {
  const response = await apiService.get<ProjectMember[]>({
    url: `/v1/projects/${projectId}/members`,
  });
  if (response.statusCode >= 400 || !response.data) {
    throw new Error(response.message || "Failed to fetch members");
  }
  return response.data;
}

// Получить тех, кого ещё можно добавить
async getParticipants(projectId: string) {
  const response = await apiService.get<ProjectParticipant[]>({
    url: `/v1/projects/${projectId}/participants`,
  });
  if (response.statusCode >= 400 || !response.data) {
    throw new Error(response.message || "Failed to fetch participants");
  }
  return response.data;
}

// Добавить пользователя в проект
async addMember(projectId: string, dto: AddMemberDto) {
  const response = await apiService.post<string>({
    url: `/v1/projects/${projectId}/members`,
    dto,
  });
  if (response.statusCode >= 400) {
    throw new Error(response.message || "Failed to add member");
  }
  return response.data;
}
```

---

# Шаг 3: Хуки с динамическим queryKey
Там же в `projectService.ts`, добавь хуки за пределами класса:

```ts
export const useProjectMembers = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "members"],
    //                    ↑ projectId ОБЯЗАТЕЛЬНО в ключе!
    queryFn: () => projectService.getMembers(projectId),
    enabled: !!projectId, // не делаем запрос если projectId пустой
  });
};

export const useProjectParticipants = (projectId: string) => {
  return useQuery({
    queryKey: ["projects", projectId, "participants"],
    queryFn: () => projectService.getParticipants(projectId),
    enabled: !!projectId,
  });
};
```

---

# Почему projectId в queryKey так важен?
Представь: пользователь смотрит участников Проекта А, потом без перезагрузки открывает Проект Б.

**Без projectId в ключе:**
```
queryKey: ["members"]  // один кеш для ВСЕХ проектов
```
Проект Б покажет участников Проекта А из кеша!

**С projectId в ключе:**
```
queryKey: ["projects", "id-проекта-А", "members"]  // свой кеш
queryKey: ["projects", "id-проекта-Б", "members"]  // свой кеш
```
Каждый проект хранит свои данные независимо. React Query сам разберётся!

---

# Шаг 4: Хук для добавления участника
Обрати внимание: `useMutation` принимает `projectId` через параметр хука, а не через `mutate()`:

```ts
export const useAddMember = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddMemberDto) =>
      projectService.addMember(projectId, dto),
    onSuccess: () => {
      // После добавления — обновляем ОБА запроса!
      // Потому что один человек убывает из "доступных" и прибывает в "участников"
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", projectId, "participants"],
      });
    },
  });
};
```
`invalidateQueries` вызывается дважды — потому что добавление участника меняет **оба** списка одновременно.

---

# Шаг 5: Состояние в Home.tsx
Нам нужно знать, **для какого проекта** открыта модалка.
**📄 `src/pages/Home.tsx`**

```tsx
// Добавь эти два состояния к существующим
const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

// Функция открытия модалки — ОБЯЗАТЕЛЬНО сбрасывает старый проект
const handleOpenMembers = (projectId: string) => {
  setSelectedProjectId(projectId);  // запоминаем КАКОЙ проект выбран
  setIsMembersModalOpen(true);
};

const handleCloseMembers = () => {
  setIsMembersModalOpen(false);
  setSelectedProjectId(null);       // сбрасываем при закрытии
};
```

Зачем `selectedProjectId`? Это "память" — когда пользователь нажимает "Members" на разных карточках, мы должны знать для какой карточки открыть модалку.

---

# Шаг 6: Кнопка в карточке проекта
Обнови каждую карточку в списке — добавь кнопку:
**📄 `src/pages/Home.tsx`**

```tsx
{projects?.map((project: Project) => (
  <div key={project.id} className="group p-6 rounded-2xl ...">
    <h3 className="font-bold text-lg mb-2">{project.name}</h3>

    <div className="mt-auto pt-4 border-t border-white/10
                    flex justify-between items-center">
      <span className="text-xs text-muted-foreground">
        ID: {project.id.slice(0, 8)}...
      </span>

      {/* Новая кнопка */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleOpenMembers(project.id)}
      >
        Members
      </Button>
    </div>
  </div>
))}
```

---

# Шаг 7: Создаём MembersModal
Создай новый файл: **📄 `src/components/MembersModal.tsx`**

```tsx
import { FC, useState } from "react";
import { CustomModal } from "@/components/ui/custom-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useProjectMembers,
  useProjectParticipants,
  useAddMember,
} from "@/services/projectService";
import { useToast } from "@/hooks/use-toast";
import { ProjectParticipant } from "@/types/member";

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}
```

---

# Шаг 8: Тело MembersModal — данные и поиск

```tsx
export const MembersModal: FC<MembersModalProps> = ({
  isOpen, onClose, projectId
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { success, error } = useToast();

  // Загружаем участников и доступных пользователей
  const { data: members, isLoading } = useProjectMembers(projectId);
  const { data: participants } = useProjectParticipants(projectId);
  const { mutate: addMember, isPending: isAdding } = useAddMember(projectId);

  // Фильтрация на ФРОНТЕНДЕ — данные уже есть в кеше, запрос не нужен!
  const filtered = participants?.filter((p: ProjectParticipant) =>
    p.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const handleAdd = (username: string) => {
    addMember({ username }, {
      onSuccess: () => success(`${username} добавлен в проект!`),
      onError: (err: any) => error(err.message || "Ошибка"),
    });
  };
```

---

# Почему поиск на фронте, а не новый запрос к API?
Когда компонент монтируется, `useProjectParticipants` **уже загружает всех** доступных пользователей.

Делать новый запрос при каждом нажатии клавиши — это:
- Лишняя нагрузка на сервер
- Задержка ответа
- Мигающий UI

Вместо этого `filter()` мгновенно ищет по **уже загруженным данным в памяти**:
```tsx
// При каждом символе в инпуте — filter() пересчитывается мгновенно
const filtered = participants?.filter((p) =>
  p.username.toLowerCase().includes(searchQuery.toLowerCase())
) ?? [];
```
Это называется **локальная фильтрация** и применяется когда данных не очень много (до нескольких сотен элементов).

---

# Шаг 9: JSX для MembersModal

```tsx
  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Участники проекта">
      {/* Текущие участники */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
        Текущие участники
      </h3>
      {isLoading ? <p>Загрузка...</p> : (
        <ul className="flex flex-col gap-2 mb-6">
          {members?.map((m) => (
            <li key={m.user.username}
                className="flex justify-between items-center p-3
                           rounded-xl bg-white/5 border border-white/10">
              <span className="font-medium">{m.user.username}</span>
              <span className="text-xs px-2 py-1 bg-primary/20 rounded-full">
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      )}
```

---

# Шаг 9 (продолжение): Поиск и добавление

```tsx
      {/* Поиск для добавления */}
      <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
        Добавить участника
      </h3>
      <Input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Поиск по username..."
        className="mb-3"
      />
      <ul className="flex flex-col gap-2 max-h-40 overflow-y-auto">
        {filtered.length === 0
          ? <p className="text-sm text-muted-foreground">Не найдено</p>
          : filtered.map((p) => (
            <li key={p.username}
                className="flex justify-between items-center p-3
                           rounded-xl bg-white/5 border border-white/10">
              <span>{p.username}</span>
              <Button size="sm" onClick={() => handleAdd(p.username)}
                      disabled={isAdding}>
                Добавить
              </Button>
            </li>
          ))
        }
      </ul>
    </CustomModal>
  );
};
```

---

# Шаг 10: Подключаем MembersModal в Home.tsx
В конце JSX, рядом с модалкой создания проекта:

```tsx
{/* Модалка создания проекта — уже была */}
<CustomModal isOpen={isModalOpen} ...>
  ...
</CustomModal>

{/* Новая модалка участников */}
{selectedProjectId && (         // рендерим ТОЛЬКО когда выбран проект
  <MembersModal
    isOpen={isMembersModalOpen}
    onClose={handleCloseMembers}
    projectId={selectedProjectId}
  />
)}
```

**Зачем `selectedProjectId &&`?**
Если `selectedProjectId` равен `null` — компонент вообще не рендерится и хуки внутри него не вызываются. Это предотвращает запросы к API с пустым `projectId`.

Если убрать эту проверку и написать просто `<MembersModal projectId={null}>` — хуки вызовутся, запрос улетит с `null` в URL. Этого допускать нельзя!

---

# Полная схема работы нового функционала

```
Пользователь нажимает "Members" на карточке
         ↓
handleOpenMembers(project.id) вызывается
         ↓
setSelectedProjectId("abc-123")  →  selectedProjectId становится "abc-123"
setIsMembersModalOpen(true)      →  модалка открывается
         ↓
<MembersModal projectId="abc-123" /> рендерится
         ↓
useProjectMembers("abc-123")    →  GET /projects/abc-123/members
useProjectParticipants("abc-123") →  GET /projects/abc-123/participants
         ↓
Список участников и доступных пользователей отображается
         ↓
Пользователь печатает "john" в поиске
         ↓
filtered = participants.filter(p => "johndoe".includes("john"))  // мгновенно!
         ↓
Пользователь нажимает "Добавить"
         ↓
useAddMember("abc-123").mutate({ username: "johndoe" })
         ↓
POST /api/v1/projects/abc-123/members  { username: "johndoe" }
         ↓
onSuccess → invalidateQueries(["projects","abc-123","members"])
          → invalidateQueries(["projects","abc-123","participants"])
         ↓
Оба списка автоматически обновляются — johndoe теперь участник!
```

---

# Итог: что нового изучили сегодня

| Концепция | Где применили | Зачем |
|---|---|---|
| **`projectId` в `queryKey`** | `useProjectMembers`, `useProjectParticipants` | Отдельный кеш для каждого проекта |
| **`enabled: !!projectId`** | Оба хука | Не делать запрос когда ID пустой |
| **Двойной `invalidateQueries`** | `useAddMember` | Обновить сразу два связанных списка |
| **Локальная фильтрация** | Поиск в `MembersModal` | Быстрый поиск без лишних запросов к API |
| **Условный рендер `id &&`** | `Home.tsx` | Запускать хуки только с реальным ID |
| **`selectedProjectId` state** | `Home.tsx` | Помнить какую именно карточку открыли |

**Следующий уровень:** создание задач внутри проекта (`POST /projects/:id/tasks`) и смена их статуса (`PATCH /projects/:id/tasks/:taskId`)
