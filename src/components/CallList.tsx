"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ICallListProps } from "@/types/components/callListTypes";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { useGetCalls } from "@/hooks/useGetCalls";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { CallType } from "@/enums/call";
import { useToast } from "./ui/use-toast";

const CallList = ({ type }: ICallListProps) => {
  const { endedCalls, upcomingCalls, callRecordings, isLoading } =
    useGetCalls();

  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const router = useRouter();
  const { toast } = useToast();

  const getCalls = () => {
    switch (type) {
      case CallType.ENDED:
        return endedCalls;

      case CallType.UPCOMING:
        return upcomingCalls;

      case CallType.RECORDINGS:
        return recordings;

      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case CallType.ENDED:
        return "No Previous Calls";

      case CallType.UPCOMING:
        return "No Upcoming calls";

      case CallType.RECORDINGS:
        return "No Recordings";

      default:
        return "";
    }
  };

  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const callData = await Promise.all(
          callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
        );

        const recordings = callData
          .filter((call) => call.recordings.length > 0)
          .flatMap((call) => call.recordings);

        setRecordings(recordings);
      } catch (error) {
        toast({
          title: "Try Again Later",
          variant: "destructive",
        });
      }
    };

    if (type === CallType.RECORDINGS) fetchRecordings();
  }, [type, callRecordings, toast]);

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {calls && calls.length > 0 ? (
        calls.map((meeting: Call | CallRecording) => (
          <MeetingCard
            key={(meeting as Call).id}
            icon={
              type === CallType.ENDED
                ? "/icons/previous.svg"
                : type === CallType.UPCOMING
                  ? "/icons/upcoming.svg"
                  : "/icons/recordings.svg"
            }
            title={
              (meeting as Call).state?.custom?.description?.substring(0, 26) ||
              (meeting as CallRecording).filename?.substring(0, 20) ||
              "Personal Meeting"
            }
            date={
              (meeting as Call).state?.startsAt?.toLocaleString() ||
              (meeting as CallRecording).start_time?.toLocaleString()
            }
            isPreviousMeeting={type === CallType.ENDED}
            buttonIcon1={
              type === CallType.RECORDINGS ? "/icons/play.svg" : undefined
            }
            buttonText={type === CallType.RECORDINGS ? "Play" : "Start"}
            handleClick={
              type === CallType.RECORDINGS
                ? () => router.push(`${(meeting as CallRecording)?.url}`)
                : () => router.push(`/meeting/${(meeting as Call)?.id}`)
            }
            link={
              type === CallType.RECORDINGS
                ? (meeting as CallRecording)?.url
                : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
            }
          />
        ))
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
