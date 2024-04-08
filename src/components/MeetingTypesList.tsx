"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import HomeCard from "./HomeCard";
import MeetingModal from "./MeetingModal";
import ReactDatePicker from "react-datepicker";
import { MeetingStatus } from "@/enums/meeting";
import { Input } from "./ui/input";

const MeetingTypesList = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();

  const [meetingState, setMeetingState] = useState<MeetingStatus | undefined>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }

      const id = crypto.randomUUID();

      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);

      if (!values.description) router.push(`/meeting/${call.id}`);

      toast({
        title: "Meeting created",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        title="New Meeting"
        description="Start an instant meeting"
        img="/icons/add-meeting.svg"
        className="bg-orange-1"
        handleClick={() => setMeetingState(MeetingStatus.IS_INSTANT)}
      />
      <HomeCard
        title="Schedule Meeting"
        description="Plan your meeting"
        img="/icons/schedule.svg"
        className="bg-blue-1"
        handleClick={() => setMeetingState(MeetingStatus.IS_SCHEDULED)}
      />
      <HomeCard
        title="View Recordings"
        description="Check out your recordings"
        img="/icons/recordings.svg"
        className="bg-purple-1"
        handleClick={() => router.push("/recordings")}
      />
      <HomeCard
        title="Join Meeting"
        description="Via invitation link"
        img="/icons/join-meeting.svg"
        className="bg-yellow-1"
        handleClick={() => setMeetingState(MeetingStatus.IS_JOINING)}
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === MeetingStatus.IS_SCHEDULED}
          onClose={() => setMeetingState(undefined)}
          title={"Create Meeting"}
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base font-normal leading-[22px] text-sky-1">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base font-normal leading-[22px] text-sky-1">
              Select data and time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat={"MMMM d, yyyy h:mm aa"}
              className="w-full rounded bg-dark-2 p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === MeetingStatus.IS_SCHEDULED}
          onClose={() => setMeetingState(undefined)}
          title={"Meeting Created"}
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Link copied" });
          }}
          img="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Meeting Link"
        />
      )}
      <MeetingModal
        isOpen={meetingState === MeetingStatus.IS_INSTANT}
        onClose={() => setMeetingState(undefined)}
        title={"Start Instant Meeting"}
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === MeetingStatus.IS_JOINING}
        onClose={() => setMeetingState(undefined)}
        title={"Type the link here"}
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => {
          values.link && router.push(`/meeting/${values.link}`);
        }}
      >
        <Input
          placeholder="Meeting Link"
          className="border-none bg-dark-2 focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypesList;
