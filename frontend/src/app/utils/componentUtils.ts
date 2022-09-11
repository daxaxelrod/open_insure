export const ConditionalWrapper = ({ condition, wrapper, children }: any) =>
    condition ? wrapper(children) : children;
