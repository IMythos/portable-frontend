interface UserBadgeProps {
    label: string;
}

const UserBadge = ({ label }: UserBadgeProps) => (
    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-indigo-100 text-indigo-700 font-semibold text-sm shadow-sm border border-indigo-200 custom-font-m">
        {label}
    </span>
);

export default UserBadge;