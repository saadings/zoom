interface IMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  className?: string;
  children?: React.ReactNode;
  buttonText?: string;
  handleClick?: () => void;
  img?: string;
  buttonIcon?: string;
}
