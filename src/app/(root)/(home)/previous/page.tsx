import CallList from "@/components/CallList";
import { CallType } from "@/enums/call";

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous</h1>

      <CallList type={CallType.ENDED} />
    </section>
  );
};

export default PreviousPage;
