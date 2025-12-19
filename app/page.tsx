import EventCard from "@/components/EventCard";
import ExploreButton from "@/components/ExploreButton";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const page = async () => {
  'use cache';
   cacheLife('hours')

  const response = await fetch(`${BASE_URL}/api/events`);
  const { events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Stage Where Every Dev <br /> Event Finds Its Spotlight
      </h1>
      <p className="text-center mt-5">
        Discover Hackathons, Workshops, and Meetups Crafted for Innovators Like
        You
      </p>

      <ExploreButton />

      <div className="mt-20 space-y-7">
        <h3>Featured Event</h3>

        <ul className="events">
          {events &&
            events.length > 0 &&
            events.map((event: IEvent) => (
              <li key={event.title} className="list-none">
                <EventCard {...event} />
              </li>
            ))}
        </ul>
      </div>
    </section>
  );
};

export default page;
