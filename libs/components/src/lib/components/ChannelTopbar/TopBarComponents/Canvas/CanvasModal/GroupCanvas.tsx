type GroupCanvasProps = {
    title: string;
    children: React.ReactNode;
};

const GroupCanvas = ({ title, children }: GroupCanvasProps) => {
    return (
        <div>
            <div className="mt-2 mb-2 h-6 text-xs font-semibold leading-6 uppercase dark:text-bgLightPrimary text-bgPrimary">{title}</div>
            {children}
        </div>
    );
};

export default GroupCanvas;
