import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.action";
import { getOrdersByUser } from "@/lib/actions/order.action";
import { IOrder } from "@/lib/database/models/order.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const ordersPage = Number(searchParams?.page || 1);
  const eventsPage = Number(searchParams?.page || 1);

  const orders = await getOrdersByUser({ userId, page: ordersPage });

  const orderedEvents = orders?.data.map((order: IOrder) => {
    return order.event || [];
  });

  const organizedEvents = await getEventsByUser({ userId, page: eventsPage });
  return (
    <>
      {/* My tickets */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/#events">Explore More Events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No events tickets purchased yet"
          emptyStateSubtext="No worries we will help you find the event you are looking for"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      {/* Events organizers */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild className="button hidden sm:flex">
            <Link href="/events/create">Create New Event</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some events now!"
          collectionType="Events_Organized"
          limit={6}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default ProfilePage;
