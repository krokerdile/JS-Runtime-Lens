import { useState } from "react";

export default function JSRuntimeLens() {
  const [code, setCode] = useState("console.log('Hello, JS Runtime Lens!')\nsetTimeout(() => { console.log('timeout'); }, 0);\nPromise.resolve().then(() => console.log('microtask'));\n");
  const [stack, setStack] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [taskQueue, setTaskQueue] = useState<string[]>([]);
  const [microtaskQueue, setMicrotaskQueue] = useState<string[]>([]);
  const [webAPI, setWebAPI] = useState<string[]>([]);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const runCode = async () => {
    setStack([]);
    setLogs([]);
    setTaskQueue([]);
    setMicrotaskQueue([]);
    setWebAPI([]);

    // Step 1: global() -> console.log()
    setStack(["global()", "console.log()"]);
    setLogs(["'Hello, JS Runtime Lens!'"]);
    await delay(1000);
    setStack(["global()"]);
    await delay(1000);

    // Step 2: setTimeout registered in Web API
    setStack(["global()", "setTimeout()"]);
    setWebAPI(["timeoutCallback"]);
    await delay(1000);
    setStack(["global()"]);
    await delay(1000);

    // Step 3: Promise.then() registered to Microtask Queue
    setStack(["global()", "Promise.then()"]);
    setMicrotaskQueue(["microtaskCallback"]);
    await delay(1000);
    setStack(["global()"]);
    await delay(1000);

    // Step 4: Execute Microtask
    setStack(["microtaskCallback"]);
    setLogs((prev) => [...prev, "microtask"]);
    setMicrotaskQueue([]);
    await delay(1000);
    setStack([]);
    await delay(1000);

    // Step 5: Web API moves to Task Queue
    setWebAPI([]);
    setTaskQueue(["timeoutCallback"]);
    await delay(1000);

    // Step 6: Execute Task
    setStack(["timeoutCallback"]);
    setLogs((prev) => [...prev, "timeout"]);
    setTaskQueue([]);
    await delay(1000);
    setStack([]);
  };

  return (
    <div className="p-4 space-y-4">
      <textarea
        className="w-full h-32 p-2 border border-gray-300 rounded"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={runCode}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Run
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <h2 className="text-lg font-bold">Call Stack</h2>
          <ul className="bg-gray-100 p-2 rounded min-h-[60px]">
            {stack.map((frame, idx) => (
              <li key={idx} className="text-sm text-gray-800">{frame}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold">Web API</h2>
          <ul className="bg-yellow-100 p-2 rounded min-h-[60px]">
            {webAPI.map((api, idx) => (
              <li key={idx} className="text-sm text-yellow-800">{api}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold">Microtask Queue</h2>
          <ul className="bg-purple-100 p-2 rounded min-h-[60px]">
            {microtaskQueue.map((task, idx) => (
              <li key={idx} className="text-sm text-purple-800">{task}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-bold">Task Queue</h2>
          <ul className="bg-green-100 p-2 rounded min-h-[60px]">
            {taskQueue.map((task, idx) => (
              <li key={idx} className="text-sm text-green-800">{task}</li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold">Console Output</h2>
        <ul className="bg-black text-green-400 font-mono p-2 rounded">
          {logs.map((log, idx) => (
            <li key={idx}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
