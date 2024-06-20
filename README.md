#### Reverse engineering the useMemo hook to help me understand it better.

The useMemo hook is used to prevent unnecessary re-executions of functions between re-renders.  On the first render, it will cache the return value of the callback argument and this becomes the return value of the hook.  The callback will not be executed again to compute a new value until one or more of the dependencies change.
