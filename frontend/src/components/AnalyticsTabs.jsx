import { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AnalyticsTabs = () => {
  const [selectedYear, setSelectedYear] = useState(2025);

  const generateMockData = (year, intensity = 1) => {
    const data = {};
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const weekday = d.getDay();
      const month = d.getMonth();

      let value = Math.floor(Math.random() * 10 * intensity);

      if (weekday > 0 && weekday < 6) {
        value += Math.floor(Math.random() * 5 * intensity);
      }

      if (month === 3 || month === 7 || month === 10) {
        value += Math.floor(Math.random() * 8 * intensity);
      }

      data[dateStr] = value;
    }
    return data;
  };

  const myData = generateMockData(selectedYear, 1.5);
  const friendData = generateMockData(selectedYear, 1.2);

  const myMaxValue = Math.max(...Object.values(myData));
  const friendMaxValue = Math.max(...Object.values(friendData));

  const getMyColor = (value) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = Math.min(Math.ceil((value / myMaxValue) * 4), 4);
    return ['bg-green-50', 'bg-green-300', 'bg-green-500', 'bg-green-700'][intensity - 1];
  };

  const getFriendColor = (value) => {
    if (value === 0) return 'bg-gray-100';
    const intensity = Math.min(Math.ceil((value / friendMaxValue) * 4), 4);
    return ['bg-blue-50', 'bg-blue-300', 'bg-blue-500', 'bg-blue-700'][intensity - 1];
  };

  const generateCalendarData = (year) => {
    const calendarGrid = [];
    const currentDate = new Date(year, 0, 1);
    const weeks = [];
    let currentWeek = [];

    while (currentDate.getFullYear() === year) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOfWeek = currentDate.getDay();
      currentWeek.push({
        date: dateStr,
        myValue: myData[dateStr] || 0,
        friendValue: friendData[dateStr] || 0,
        weekday: dayOfWeek,
        month: currentDate.getMonth()
      });
      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (currentWeek.length) weeks.push(currentWeek);
    return weeks;
  };

  const calendarData = generateCalendarData(selectedYear);

  // GitHub Rank Radar Chart Data
  const githubRankData = [
    {
      subject: 'Activity',
      You: 85,
      Friend: 65,
      fullMark: 100,
    },
    {
      subject: 'Popularity',
      You: 70,
      Friend: 90,
      fullMark: 100,
    },
    {
      subject: 'Collaboration',
      You: 80,
      Friend: 75,
      fullMark: 100,
    },
    {
      subject: 'Code Quality',
      You: 90,
      Friend: 70,
      fullMark: 100,
    },
    {
      subject: 'Impact',
      You: 65,
      Friend: 80,
      fullMark: 100,
    },
    {
      subject: 'Consistency',
      You: 75,
      Friend: 85,
      fullMark: 100,
    },
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-lg p-6 border-blue-500 border-2">
      <h2 className="text-3xl font-bold mb-6">Analytics Dashboard</h2>
      <div className='bg-white border-blue-300 border-2 rounded-xl p-2 mb-5 shadow-md'>
      <div className="flex items-center space-x-4 mb-4">
        <span
          className={`cursor-pointer px-2 py-1 rounded ${selectedYear === 2024 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
          onClick={() => setSelectedYear(2024)}
          >
          2024
        </span>
        <span
          className={`cursor-pointer px-2 py-1 rounded ${selectedYear === 2025 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
          onClick={() => setSelectedYear(2025)}
          >
          2025
        </span>
      </div>
          <h3 className="text-xl font-bold ">Your Activity</h3>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Month Labels */}
          <div className="flex ml-10 mb-1">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="text-xs text-gray-500 w-16 text-center">
                {new Date(0, i).toLocaleString('default', { month: 'short' })}
              </div>
            ))}
          </div>

          {/* Weekday Labels + Heatmap */}
          <div className="flex">
            <div className="flex flex-col mr-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={idx} className="text-xs text-gray-500 h-4 mb-1">{day}</div>
              ))}
            </div>

            <div className="flex">
              {calendarData.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col mr-1">
                  {week.map((day, dayIdx) => (
                    <div
                    key={dayIdx}
                    className={`w-4 h-4 mb-1 rounded-sm ${getMyColor(day.myValue)}`}
                    title={`Date: ${day.date}\nMy Activity: ${day.myValue}`}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-2">Friend's Activity</h3>
          <div className="flex">
            <div className="flex flex-col mr-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
                <div key={idx} className="text-xs text-gray-500 h-4 mb-1">{day}</div>
              ))}
            </div>

            <div className="flex">
              {calendarData.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col mr-1">
                  {week.map((day, dayIdx) => (
                    <div
                    key={dayIdx}
                    className={`w-4 h-4 mb-1 rounded-sm ${getFriendColor(day.friendValue)}`}
                    title={`Date: ${day.date}\nFriend's Activity: ${day.friendValue}`}
                    ></div>
                  ))}
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className='bg-white text-lg border-blue-300 border-2 rounded-xl p-4 shadow-md'>
          <h2 className='font-bold text-2xl mb-4'>GitHub Rank</h2>
          <div className="flex items-center justify-center">
            <div className="w-full h-150">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={githubRankData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4a5568', fontSize: 16 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 16 }} />
                  <Tooltip />
                  <Legend />
                  <Radar name="You" dataKey="You" stroke="#fca5a5" fill="#fca5a5" fillOpacity={0.6} />
                  <Radar name="Friend" dataKey="Friend" stroke="#93c5fd" fill="#93c5fd" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mt-4 flex justify-center space-x-8">
            <div className="text-center">
              <h3 className="text-base font-semibold">Overall Rank</h3>
              <div className="mt-2">
                <span className="bg-red-100 text-red-800 font-medium px-3 py-1 rounded-full">You: 78/100</span>
              </div>
            </div>
            <div className="text-center">
              <h3 className="font-semibold">Overall Rank</h3>
              <div className="mt-2">
                <span className="bg-blue-100 text-blue-800 font-medium px-3 py-1 rounded-full">Friend: 77/100</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default AnalyticsTabs;