import React from "react";
import { useState } from "react";

export default function App() {
    return (
        <>
            <Counter />
        </>
    );
}

function Counter(): React.ReactNode {
    const [count, setCount] = useState<number>(0);
    const [dummy, setDummy] = useState<number>(0);

    const foobar = useCustomMemo(() => {
        for (let i = 0; i < 1000000000; ++i) {}
        console.log("Callback executed");
        return dummy;
    }, [dummy]);

    return (
        <main>
            <p>{foobar}</p>
            <CounterLabel count={count} />
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setDummy(dummy + 1)}>Dummy Counter</button>
        </main>
    );
}

function CounterLabel({ count }: { count: number }): React.ReactNode {
    return <p>{`Count: ${count}`}</p>;
}

interface MemoState<T, K> {
    deps: K[];
    val: T | null;
    isFirstRender: boolean;
}

function useCustomMemo<T, K>(cb: () => T, deps: K[]): T {
    /* You cannot use the callback function to generate the computed value here.
     * useState is a function just like any other and therefore it is still
     * called every time this hook runs, which defeats the purpose of the hook.
     * While that might seem obvious, it wasn't my first thought */
    const [memoState, setMemoState] = useState<MemoState<T, K>>({
        deps: deps,
        val: null,
        isFirstRender: true,
    });

    let isSame: boolean = true;

    for (let i = 0; i < deps.length; ++i) {
        if (deps[i] !== memoState.deps[i]) {
            isSame = false;
            break;
        }
    }

    if (isSame && !memoState.isFirstRender) {
        return memoState.val!;
    }

    const newVal: T = cb();

    setMemoState({
        ...memoState,
        deps: deps,
        val: newVal,
        isFirstRender: false,
    });

    return newVal;
}
