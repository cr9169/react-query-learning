import "./App.css";
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Rank = "Sergeant" | "Corporal" | "Private" | "Lieutenant";

type User = {
  id: string;
  name: string;
  rank: Rank;
};

type Report = {
  id: string;
  date: string;
  sleepStatus: string;
  duration: number;
  location: string;
  user: User;
};

const generateRandomId = (): string => Math.random().toString(36).substr(2, 9);

const generateRandomName = (): string => {
  const names = ["John Doe", "Jane Smith", "Mike Johnson", "Emily Davis"];
  return names[Math.floor(Math.random() * names.length)];
};

const generateRandomRank = (): Rank => {
  const ranks: Rank[] = ["Sergeant", "Corporal", "Private", "Lieutenant"];
  return ranks[Math.floor(Math.random() * ranks.length)];
};

const generateRandomSleepStatus = (): string => {
  const statuses = ["Asleep", "Awake"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateRandomDuration = (): number => Math.floor(Math.random() * 8);

const generateRandomLocation = (): string => {
  const locations = [
    "Dormitory A",
    "Dormitory B",
    "Dormitory C",
    "Dormitory D",
  ];
  return locations[Math.floor(Math.random() * locations.length)];
};

const generateRandomReport = (): Report => {
  return {
    id: generateRandomId(),
    date: new Date().toISOString().split("T")[0],
    sleepStatus: generateRandomSleepStatus(),
    duration:
      generateRandomSleepStatus() === "Asleep" ? generateRandomDuration() : 0,
    location: generateRandomLocation(),
    user: {
      id: generateRandomId(),
      name: generateRandomName(),
      rank: generateRandomRank(),
    },
  };
};

const reports: Report[] = [
  {
    id: "001",
    date: "2024-09-30",
    sleepStatus: "Asleep",
    duration: 6,
    location: "Dormitory A",
    user: {
      id: "U001",
      name: "John Doe",
      rank: "Sergeant",
    },
  },
  {
    id: "002",
    date: "2024-09-30",
    sleepStatus: "Awake",
    duration: 0,
    location: "Dormitory B",
    user: {
      id: "U002",
      name: "Jane Smith",
      rank: "Corporal",
    },
  },
  {
    id: "003",
    date: "2024-09-30",
    sleepStatus: "Asleep",
    duration: 4,
    location: "Dormitory C",
    user: {
      id: "U003",
      name: "Mike Johnson",
      rank: "Private",
    },
  },
  {
    id: "004",
    date: "2024-09-30",
    sleepStatus: "Asleep",
    duration: 7,
    location: "Dormitory D",
    user: {
      id: "U004",
      name: "Emily Davis",
      rank: "Lieutenant",
    },
  },
];

const warpHeader = (headerContent: React.ReactNode) => {
  return <header>{headerContent}</header>;
};

function App() {
  console.log(reports);

  const queryClient = useQueryClient();

  const reportsQuery = useQuery({
    refetchOnWindowFocus: true,
    queryKey: ["reports"],
    queryFn: () => [...reports],
  });

  const newReportMutation = useMutation({
    mutationFn: async (report: Report) => {
      return reports.push({ ...report, id: `00${reports.length + 1}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  if (reportsQuery.isLoading) return warpHeader(<h1>Loading...</h1>);
  if (reportsQuery.isError)
    return warpHeader(
      <pre>{JSON.stringify(reportsQuery.error).split('"').join("")}</pre>
    );

  return (
    <>
      <header>
        <h1>Your React Query App</h1>
      </header>
      <section className="reports-section">
        {reportsQuery.data?.map((report: Report) => (
          <div className="report" key={report.id}>
            <span>{report.location}</span>
            <span>{report.date}</span>
          </div>
        ))}
      </section>
      <button
        className="add-report-button"
        disabled={newReportMutation.isPending}
        //                               (activates the mutationFn)
        onClick={() => newReportMutation.mutate(generateRandomReport())}
      >
        Add New Report
      </button>
    </>
  );
}

// const sleep = (duration: number) => {
//   return new Promise((res) => setTimeout(res, duration));
// };

export default App;
