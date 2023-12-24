export interface IUserDetailsProps {
  username?: string;
  avatarUrl?: string;
  followers?: number;
  following?: number;
  bio?: string;
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOptions: { value: string; label: string }[];
}
