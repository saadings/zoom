import DateTimeDisplay from "@/components/DateTimeDisplay";
import MeetingTypesList from "@/components/MeetingTypesList";

const Home = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 md:p-11">
          <DateTimeDisplay />
        </div>
      </div>

      <MeetingTypesList />
    </section>
  );
};

export default Home;
