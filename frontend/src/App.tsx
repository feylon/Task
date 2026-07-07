import { useEffect, useState } from "react";
import PlaceMark from "./component/placeMark";
import { API_URL } from "./global/config";
import { FaCarSide } from "react-icons/fa";
import { IoPower } from "react-icons/io5";

export interface ICars {
  id: number;
  ignition: boolean;
  lat: number;
  lng: number;
  model_name: string;
  occurred_at: string;
  plate_number: string;
  speed: number;
}

export default function App() {
  const [carList, setCarlist] = useState<ICars[]>([]);
  const [selectedCar, setSelectedCar] = useState<ICars | null>(null);
  const [trace, setTrace] = useState<any[]>([]);

useEffect(() => {
  if (selectedCar) {
    const fetchTrace = async () => {
      const to = new Date().toISOString();
      const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); 
      
      const res = await fetch(`${API_URL}api/vehicles/${selectedCar.id}/pings?from=${from}&to=${to}`);
      const data = await res.json();
      setTrace(data.trace || []);
      console.log(data)
    };
    fetchTrace();
  } else {
    setTrace([]);
  }
}, [selectedCar]);
useEffect(() => {
  async function fetchDataCars() {
    try {
      const res = await fetch(`${API_URL}api/vehicles`);
      console.log("Status:", res.status); 
      
      if (!res.ok) throw new Error("Serverdan xatolik qaytdi");
      
      const data = await res.json();
      console.log("Kelgan ma'lumot:", data); 
      setCarlist(data);
    } catch (error) {
      console.error("Fetch xatoligi:", error);
    }
  }
  fetchDataCars();


   setInterval(() => {
    fetchDataCars();
  }, 10000);
}, []);

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="w-[25%] bg-blue-700 flex flex-col overflow-y-auto">
        <h2 className="text-white p-4 font-bold text-xl">Avtomobillar</h2>

        <button
          onClick={() => setSelectedCar(null)}
          className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-400"
        >
          Barcha mashinalar
        </button>

        {carList.map((car) => (
          <div
            key={car.id}
            onClick={() => setSelectedCar(car)}
            className={`cursor-pointer border-b border-blue-600 p-4 flex items-center gap-4 transition-colors ${selectedCar?.id === car.id ? "bg-blue-100" : "bg-white hover:bg-gray-100"
              }`}
          >
            <FaCarSide className="text-5xl text-blue-600 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg font-bold">{car.model_name}</span>
              <span className="text-sm">Tezlik: {car.speed} km/soat</span>
              <span className="flex items-center gap-2 text-sm">
                Holati:
                <IoPower className={car.ignition ? "text-green-500" : "text-red-400"} size={16} />
                {car.ignition ? "Yoniq" : "O'chik"}
              </span>
            </div>
          </div>
        ))}
      </div>

      { }
      <div className="w-[75%] h-full">
        <PlaceMark
          height={100}
          width={100}
          cars={carList}
          selectedCar={selectedCar}
          trace={trace}
        />
      </div>
    </div>
  );
}