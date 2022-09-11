export const ConditionalWrapper = ({
    condition,
    wrapper,
    children,
}: {
    condition: boolean;
    wrapper: any;
    children: any; // JSX.Element or JSX.Element[] ?;
}) => (condition ? wrapper(children) : children);
