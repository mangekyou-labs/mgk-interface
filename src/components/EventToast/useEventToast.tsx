import { appEventsData, homeEventsData } from "config/events";
import { isFuture, parse } from "date-fns";
import { useChainId } from "lib/chains";
import { isHomeSite } from "lib/legacy";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocalStorage } from "react-use";
import EventToast from "./EventToast";

function useEventToast() {
  const isHome = isHomeSite();
  const [visited, setVisited] = useLocalStorage<string[]>("visited-announcements", []);
  const { chainId } = useChainId();

  useEffect(() => {
    const eventsData = isHome ? homeEventsData : appEventsData;

    eventsData
      .filter((event) => event.isActive)
      .filter(
        (event) => !event.startDate || !isFuture(parse(event.startDate + ", +00", "d MMM yyyy, H:mm, x", new Date()))
      )
      .filter((event) => isFuture(parse(event.endDate + ", +00", "d MMM yyyy, H:mm, x", new Date())))
      .filter((event) => Array.isArray(visited) && !visited.includes(event.id))
      .filter((event) => !event.chains || event.chains.includes(chainId))
      .forEach((event) => {
        toast.custom(
          (t) => (
            <EventToast
              event={event}
              id={event.id}
              toast={t}
              onClick={() => {
                toast.dismiss(event.id);
                const newVisited = visited ? [...visited, event.id] : [event.id];
                setVisited(newVisited);
              }}
            />
          ),
          {
            id: event.id,
            style: {},
          }
        );
      });
  }, [visited, setVisited, isHome, chainId]);
}

export default useEventToast;
