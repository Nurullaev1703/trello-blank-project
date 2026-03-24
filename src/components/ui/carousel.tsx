import { API_URL } from "@/lib/api";
import { FC, useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { WarningCircleIcon } from "@phosphor-icons/react";

export interface CarouselItem {
  index: number;
  imgUrl: string;
}

interface Props {
  height?: string;
  ratio?: string;
  items: CarouselItem[];
  currentItemId?: number;
  radius?: string;
  hasDelete?: boolean;
}

export const Carousel: FC<Props> = ({
  height = "h-60",
  items,
  ratio = "",
  currentItemId = 0,
  radius = "rounded-2xl",
  hasDelete,
}) => {
  // Create a ref typed as Slider
  const sliderRef = useRef<Slider | null>(null);

  useEffect(() => {
    if (sliderRef.current) {
      const slickList = (sliderRef.current as any).innerSlider.list; // Using any to access internal Slider properties
      const firstSlide = slickList.querySelector(".slick-slide");

      if (firstSlide) {
        // Set slick-list height based on the first slide height
        if (height) {
          slickList.classList.add(height);
        }
        if (ratio) {
          slickList.classList.add(ratio);
        }
      }
    }
  }, []);
  // Fall back to a placeholder if no images are provided
  const displayedItems =
    items.length > 0
      ? items.map((item) => ({
          ...item,
          imgUrl:
            item.imgUrl.startsWith("http") || hasDelete
              ? item.imgUrl
              : API_URL + item.imgUrl,
        }))
      : [{ index: 0, imgUrl: "" }];
  const [activeIndex, setActiveIndex] = useState<number>(currentItemId);
  // Disable infinite scroll when there is only one image
  const settings = {
    dots: displayedItems.length > 1,
    infinite: displayedItems.length > 1, // Only when more than one image
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    pauseOnFocus: true,
    initialSlide: currentItemId,
    beforeChange: (_: number, current: number) => setActiveIndex(current),
    customPaging: (i: number) => (
      <div
        className={`${
          i === activeIndex ? `w-5 bg-dark-blue` : `w-2 bg-primary-gray`
        } h-2 rounded-full transition-all duration-500 `}
      />
    ),
    dotsClass: "slick-dots custom-dots absolute bottom-0 left-0 h-fit",
  };

  return (
    <Slider
      {...settings}
      className={radius + " overflow-y-hidden"}
      ref={sliderRef}
    >
      {displayedItems.map((item) => (
        <div
          key={item.index}
          className={`${height} ${ratio} w-full flex items-center justify-center relative`}
        >
          {item.imgUrl ? (
            <img
              src={item.imgUrl}
              className="absolute top-0 left-0 object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-light-gray">
              <WarningCircleIcon
                className="w-12 h-12 text-primary-blue"
                weight="duotone"
              />
            </div>
          )}
        </div>
      ))}
    </Slider>
  );
};
Carousel.displayName = "Carousel";
