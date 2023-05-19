import { useVideos } from "@app/lib/client/hooks/api/useVideos";
import { useDebounce } from "@app/lib/client/hooks/useDebounce";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { MenuMoreButton } from "./MenuMoreButton";
import { MenuSearchItem } from "./MenuSearchItem";

const MAX_VIDEOS_TO_SHOW = 5;
const MENU_SEARCH_WIDTH = "40em";

export const MenuSearch = () => {
  const [searchText, setSearchText] = useState<string>("");

  const debouncedSearchText = useDebounce(searchText, 250);

  const { data: { videos } = {}, isLoading } = useVideos(
    { searchText: debouncedSearchText },
    !!debouncedSearchText
  );

  return (
    <Popover isOpen={!!debouncedSearchText} placement="bottom-end">
      <PopoverTrigger>
        <Input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          width={MENU_SEARCH_WIDTH}
          // Don't let popover steal focus while typing
          ref={(input) => input?.focus()}
        />
      </PopoverTrigger>
      <PopoverContent
        marginTop="-10px"
        rounded="sm"
        width={MENU_SEARCH_WIDTH}
        padding="1em"
      >
        {isLoading ? (
          <Spinner margin="auto" />
        ) : videos?.length ? (
          <>
            {videos.slice(0, MAX_VIDEOS_TO_SHOW).map((video) => (
              <MenuSearchItem
                key={video.id}
                video={video}
                onClick={() => setSearchText("")}
              />
            ))}
            {videos.length > MAX_VIDEOS_TO_SHOW && <MenuMoreButton />}
          </>
        ) : (
          "No videos found."
        )}
      </PopoverContent>
    </Popover>
  );
};
