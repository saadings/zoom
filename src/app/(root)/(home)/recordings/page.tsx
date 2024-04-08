import CallList from "@/components/CallList";
import { CallType } from "@/enums/call";

const RecordingsPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Recordings</h1>

      <CallList type={CallType.RECORDINGS} />
    </section>
  );
};

export default RecordingsPage;
