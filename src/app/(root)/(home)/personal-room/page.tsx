"use client";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useGetCallById } from "@/hooks/useGetCallById";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";

const Table = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 xl:flex-row">
      <h1 className="text-base font-medium text-sky-1 lg:text-xl xl:min-w-32">
        {title}
      </h1>
      <h1 className="font-bol truncate text-sm max-sm:max-w-[320px] lg:text-xl">
        {description}
      </h1>
    </div>
  );
};

const PersonalRoomPage = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();

  const meetingId = user?.id!;
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meetingId}?personal=true`;
  const { call } = useGetCallById(meetingId!);
  const client = useStreamVideoClient();

  const startRoom = async () => {
    if (!client || !user) return;

    if (!call) {
      const newCall = client.call("default", meetingId);

      await newCall.getOrCreate({
        data: {
          starts_at: new Date().toISOString(),
        },
      });
    }

    router.push(`/meeting/${meetingId}?personal=true`);
  };

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Personal Room</h1>

      <div className="flex w-full max-w-[900px] flex-col gap-8">
        <Table
          title="Topic:"
          description={`${user?.username}'s Meeting Room`}
        />
        <Table title="Meeting ID:" description={`${meetingId!}`} />
        <Table title="Invite Link:" description={`${meetingLink}`} />
      </div>

      <div className="flex gap-5">
        <Button className="bg-blue-1" onClick={startRoom}>
          Start Meeting
        </Button>

        <Button
          className="bg-dark-2"
          onClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({
              title: "Link Copied",
            });
          }}
        >
          Copy Invitation
        </Button>
      </div>
    </section>
  );
};

export default PersonalRoomPage;
