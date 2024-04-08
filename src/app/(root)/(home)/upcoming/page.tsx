import CallList from "@/components/CallList";
import { CallType } from "@/enums/call";

const UpcomingPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Upcoming</h1>

      <CallList type={CallType.UPCOMING} />
    </section>
  );
};

export default UpcomingPage;
