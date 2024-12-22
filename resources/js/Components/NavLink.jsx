export default function NavLink({ href, active, children, className }) {
    return (
        <a
            href={href}
            className={
                `inline-flex items-center px-1 pt-1 border-b-2 ${
                    active
                        ? 'border-indigo-400 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }` + ` ${className || ''}`
            }
        >
            {children}
        </a>
    );
}
