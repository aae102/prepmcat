import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, BookOpen, CheckCircle2, Circle, Plus, Trash2, BarChart3 } from 'lucide-react';

const MCATTracker = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayTasks, setTodayTasks] = useState([]);
  const [flScores, setFlScores] = useState([
    { date: '2025-12-20', exam: 'Diagnostic', total: 489, cp: 122, cars: 122, bb: 122, ps: 123 }
  ]);
  const [dailyProgress, setDailyProgress] = useState({});

  const barColorClass: Record<string, string> = {
    blue: "bg-blue-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
    pink: "bg-pink-600",
  };

  const studyPlan = {
    '2024-12-29': ['Gen Chem Ch 6 (Math & Equilibrium)', 'Anki review', 'CARS practice'],
    // ...existing studyPlan entries...
    '2025-06-12': ['🎯 MCAT TEST DAY! 🎯', 'Trust your preparation', 'You\'ve got this!'],
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tasks = studyPlan[today] || ['No tasks scheduled for today'];
    const completed = dailyProgress[today] || [];
    setTodayTasks(tasks.map((task, i) => ({ id: i, text: task, completed: completed.includes(i) })));
  }, [dailyProgress]);

  const toggleTask = (id) => {
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = dailyProgress[today] || [];
    const newProgress = currentProgress.includes(id)
      ? currentProgress.filter(i => i !== id)
      : [...currentProgress, id];
    setDailyProgress({ ...dailyProgress, [today]: newProgress });
  };

  const addFL = () => {
    const newFL = {
      date: new Date().toISOString().split('T')[0],
      exam: `FL ${flScores.length}`,
      total: 0,
      cp: 0,
      cars: 0,
      bb: 0,
      ps: 0
    };
    setFlScores([...flScores, newFL]);
  };

  const updateFL = (index, field, value) => {
    const updated = [...flScores];
    updated[index][field] = field === 'date' || field === 'exam' ? value : parseInt(value) || 0;
    if (field !== 'date' && field !== 'exam') {
      updated[index].total = (updated[index].cp || 0) + (updated[index].cars || 0) + (updated[index].bb || 0) + (updated[index].ps || 0);
    }
    setFlScores(updated);
  };

  const deleteFL = (index) => {
    setFlScores(flScores.filter((_, i) => i !== index));
  };

  const calculateGrowth = () => {
    if (flScores.length < 2) return { total: 0, cp: 0, cars: 0, bb: 0, ps: 0 };
    const first = flScores[0];
    const last = flScores[flScores.length - 1];
    return {
      total: last.total - first.total,
      cp: last.cp - first.cp,
      cars: last.cars - first.cars,
      bb: last.bb - first.bb,
      ps: last.ps - first.ps
    };
  };

  const getTargetScore = () => 515;
  const getPointsNeeded = () => {
    const latest = flScores[flScores.length - 1];
    return getTargetScore() - latest.total;
  };

  const completionRate = () => {
    const completed = todayTasks.filter(t => t.completed).length;
    return todayTasks.length > 0 ? Math.round((completed / todayTasks.length) * 100) : 0;
  };

  const growth = calculateGrowth();
  const targetScore = getTargetScore();
  const pointsNeeded = getPointsNeeded();
  const latestScore = flScores[flScores.length - 1];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">MCAT Tracker</h1>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">MCAT Study Tracker</h1>
              <p className="text-gray-600">Test Date: June 12, 2025</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{latestScore.total}</div>
              <div className="text-sm text-gray-500">Current Score</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{targetScore}</div>
              <div className="text-xs text-gray-600">Target Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">+{growth.total}</div>
              <div className="text-xs text-gray-600">Total Growth</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{pointsNeeded}</div>
              <div className="text-xs text-gray-600">Points Needed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{completionRate()}%</div>
              <div className="text-xs text-gray-600">Today's Progress</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'today'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="inline w-5 h-5 mr-2" />
              Today's Tasks
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="inline w-5 h-5 mr-2" />
              Full Calendar
            </button>
            <button
              onClick={() => setActiveTab('scores')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'scores'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="inline w-5 h-5 mr-2" />
              Score Tracker
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'progress'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Progress
            </button>
          </div>

          <div className="p-6">
            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Study Calendar</h2>
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {Object.entries(studyPlan).sort().map(([date, tasks]) => {
                    const completed = dailyProgress[date] || [];
                    const completionRateLocal = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
                    const dateObj = new Date(date + 'T00:00:00');
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const isFL = tasks.some(t => t.includes('FULL-LENGTH'));
                    const isLight = tasks.some(t => t.includes('LIGHT') || t.includes('BREAK') || t.includes('REST'));
                    const isTaper = tasks.some(t => t.includes('TAPER'));
                    const isTestDay = tasks.some(t => t.includes('TEST DAY'));

                    return (
                      <div
                        key={date}
                        className={`border-2 rounded-lg p-4 ${
                          isTestDay
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-300'
                            : isToday
                            ? 'bg-blue-50 border-blue-400 shadow-md'
                            : isFL
                            ? 'bg-purple-50 border-purple-300'
                            : isTaper
                            ? 'bg-green-50 border-green-300'
                            : isLight
                            ? 'bg-gray-50 border-gray-300'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                              </h3>
                              {isToday && (
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">TODAY</span>
                              )}
                              {isFL && (
                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">FULL-LENGTH</span>
                              )}
                              {isLight && !isFL && (
                                <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">LIGHT DAY</span>
                              )}
                              {isTaper && (
                                <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">TAPER</span>
                              )}
                              {isTestDay && (
                                <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded animate-pulse">TEST DAY</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{completionRateLocal}%</div>
                            <div className="text-xs text-gray-500">{completed.length}/{tasks.length} done</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {tasks.map((task, idx) => {
                            const isCompleted = completed.includes(idx);
                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  const currentProgress = dailyProgress[date] || [];
                                  const newProgress = currentProgress.includes(idx)
                                    ? currentProgress.filter(i => i !== idx)
                                    : [...currentProgress, idx];
                                  setDailyProgress({ ...dailyProgress, [date]: newProgress });
                                }}
                                className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                                  isCompleted
                                    ? 'bg-green-100 border-green-300'
                                    : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                )}
                                <span
                                  className={`text-sm ${
                                    isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                                  }`}
                                >
                                  {task}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Today's Tasks Tab */}
            {activeTab === 'today' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Schedule</h2>
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <span
                        className={`text-lg ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
                {todayTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No tasks scheduled for today</p>
                  </div>
                )}
              </div>
            )}

            {/* Score Tracker Tab */}
            {activeTab === 'scores' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Full-Length Scores</h2>
                  <button
                    onClick={addFL}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add FL
                  </button>
                </div>

                <div className="space-y-4">
                  {flScores.map((fl, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        <div>
                          <input
                            type="date"
                            value={fl.date}
                            onChange={(e) => updateFL(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={fl.exam}
                            onChange={(e) => updateFL(index, 'exam', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm font-semibold"
                            placeholder="Exam name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">C/P</label>
                          <input
                            type="number"
                            value={fl.cp}
                            onChange={(e) => updateFL(index, 'cp', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">CARS</label>
                          <input
                            type="number"
                            value={fl.cars}
                            onChange={(e) => updateFL(index, 'cars', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">B/B</label>
                          <input
                            type="number"
                            value={fl.bb}
                            onChange={(e) => updateFL(index, 'bb', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">P/S</label>
                          <input
                            type="number"
                            value={fl.ps}
                            onChange={(e) => updateFL(index, 'ps', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-600">Total</div>
                            <div className="text-2xl font-bold text-blue-600">{fl.total}</div>
                          </div>
                          {index > 0 && (
                            <button
                              onClick={() => deleteFL(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Score Progress</h2>

                {/* Overall Progress */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Overall Improvement</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">+{growth.total}</div>
                      <div className="text-xs text-gray-600 mt-1">Total</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">+{growth.cp}</div>
                      <div className="text-xs text-gray-600 mt-1">C/P</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">+{growth.cars}</div>
                      <div className="text-xs text-gray-600 mt-1">CARS</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">+{growth.bb}</div>
                      <div className="text-xs text-gray-600 mt-1">B/B</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-pink-600">+{growth.ps}</div>
                      <div className="text-xs text-gray-600 mt-1">P/S</div>
                    </div>
                  </div>
                </div>

                {/* Section Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Current Section Scores</h3>
                  {[
                    { name: 'C/P', score: latestScore.cp, color: 'blue' },
                    { name: 'CARS', score: latestScore.cars, color: 'orange' },
                    { name: 'B/B', score: latestScore.bb, color: 'purple' },
                    { name: 'P/S', score: latestScore.ps, color: 'pink' }
                  ].map((section) => (
                    <div key={section.name} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{section.name}</span>
                        <span className="text-2xl font-bold text-gray-800">{section.score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${barColorClass[section.color]} h-3 rounded-full transition-all`}
                          style={{ width: `${((section.score - 118) / 14) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>118</span>
                        <span>132</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Goal Progress */}
                <div className="mt-6 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Goal Progress</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {latestScore.total}</span>
                      <span>Target: {targetScore}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all"
                        style={{ width: `${(latestScore.total / targetScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {pointsNeeded > 0 
                        ? `${pointsNeeded} points to goal` 
                        : `Goal achieved! ${Math.abs(pointsNeeded)} points above target`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCATTracker;
```// filepath: c:\Users\aniya\mcat-tracker\src\MCATTracker.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Target, BookOpen, CheckCircle2, Circle, Plus, Trash2, BarChart3 } from 'lucide-react';

const MCATTracker = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayTasks, setTodayTasks] = useState([]);
  const [flScores, setFlScores] = useState([
    { date: '2025-12-20', exam: 'Diagnostic', total: 489, cp: 122, cars: 122, bb: 122, ps: 123 }
  ]);
  const [dailyProgress, setDailyProgress] = useState({});

  const barColorClass: Record<string, string> = {
    blue: "bg-blue-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
    pink: "bg-pink-600",
  };

  const studyPlan = {
    '2024-12-29': ['Gen Chem Ch 6 (Math & Equilibrium)', 'Anki review', 'CARS practice'],
    // ...existing studyPlan entries...
    '2025-06-12': ['🎯 MCAT TEST DAY! 🎯', 'Trust your preparation', 'You\'ve got this!'],
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const tasks = studyPlan[today] || ['No tasks scheduled for today'];
    const completed = dailyProgress[today] || [];
    setTodayTasks(tasks.map((task, i) => ({ id: i, text: task, completed: completed.includes(i) })));
  }, [dailyProgress]);

  const toggleTask = (id) => {
    const today = new Date().toISOString().split('T')[0];
    const currentProgress = dailyProgress[today] || [];
    const newProgress = currentProgress.includes(id)
      ? currentProgress.filter(i => i !== id)
      : [...currentProgress, id];
    setDailyProgress({ ...dailyProgress, [today]: newProgress });
  };

  const addFL = () => {
    const newFL = {
      date: new Date().toISOString().split('T')[0],
      exam: `FL ${flScores.length}`,
      total: 0,
      cp: 0,
      cars: 0,
      bb: 0,
      ps: 0
    };
    setFlScores([...flScores, newFL]);
  };

  const updateFL = (index, field, value) => {
    const updated = [...flScores];
    updated[index][field] = field === 'date' || field === 'exam' ? value : parseInt(value) || 0;
    if (field !== 'date' && field !== 'exam') {
      updated[index].total = (updated[index].cp || 0) + (updated[index].cars || 0) + (updated[index].bb || 0) + (updated[index].ps || 0);
    }
    setFlScores(updated);
  };

  const deleteFL = (index) => {
    setFlScores(flScores.filter((_, i) => i !== index));
  };

  const calculateGrowth = () => {
    if (flScores.length < 2) return { total: 0, cp: 0, cars: 0, bb: 0, ps: 0 };
    const first = flScores[0];
    const last = flScores[flScores.length - 1];
    return {
      total: last.total - first.total,
      cp: last.cp - first.cp,
      cars: last.cars - first.cars,
      bb: last.bb - first.bb,
      ps: last.ps - first.ps
    };
  };

  const getTargetScore = () => 515;
  const getPointsNeeded = () => {
    const latest = flScores[flScores.length - 1];
    return getTargetScore() - latest.total;
  };

  const completionRate = () => {
    const completed = todayTasks.filter(t => t.completed).length;
    return todayTasks.length > 0 ? Math.round((completed / todayTasks.length) * 100) : 0;
  };

  const growth = calculateGrowth();
  const targetScore = getTargetScore();
  const pointsNeeded = getPointsNeeded();
  const latestScore = flScores[flScores.length - 1];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">MCAT Tracker</h1>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">MCAT Study Tracker</h1>
              <p className="text-gray-600">Test Date: June 12, 2025</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{latestScore.total}</div>
              <div className="text-sm text-gray-500">Current Score</div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{targetScore}</div>
              <div className="text-xs text-gray-600">Target Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">+{growth.total}</div>
              <div className="text-xs text-gray-600">Total Growth</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{pointsNeeded}</div>
              <div className="text-xs text-gray-600">Points Needed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{completionRate()}%</div>
              <div className="text-xs text-gray-600">Today's Progress</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'today'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Calendar className="inline w-5 h-5 mr-2" />
              Today's Tasks
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="inline w-5 h-5 mr-2" />
              Full Calendar
            </button>
            <button
              onClick={() => setActiveTab('scores')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'scores'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="inline w-5 h-5 mr-2" />
              Score Tracker
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                activeTab === 'progress'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp className="inline w-5 h-5 mr-2" />
              Progress
            </button>
          </div>

          <div className="p-6">
            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Study Calendar</h2>
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {Object.entries(studyPlan).sort().map(([date, tasks]) => {
                    const completed = dailyProgress[date] || [];
                    const completionRateLocal = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
                    const dateObj = new Date(date + 'T00:00:00');
                    const isToday = date === new Date().toISOString().split('T')[0];
                    const isFL = tasks.some(t => t.includes('FULL-LENGTH'));
                    const isLight = tasks.some(t => t.includes('LIGHT') || t.includes('BREAK') || t.includes('REST'));
                    const isTaper = tasks.some(t => t.includes('TAPER'));
                    const isTestDay = tasks.some(t => t.includes('TEST DAY'));

                    return (
                      <div
                        key={date}
                        className={`border-2 rounded-lg p-4 ${
                          isTestDay
                            ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-orange-300'
                            : isToday
                            ? 'bg-blue-50 border-blue-400 shadow-md'
                            : isFL
                            ? 'bg-purple-50 border-purple-300'
                            : isTaper
                            ? 'bg-green-50 border-green-300'
                            : isLight
                            ? 'bg-gray-50 border-gray-300'
                            : 'bg-white border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-gray-800">
                                {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                              </h3>
                              {isToday && (
                                <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">TODAY</span>
                              )}
                              {isFL && (
                                <span className="px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded">FULL-LENGTH</span>
                              )}
                              {isLight && !isFL && (
                                <span className="px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">LIGHT DAY</span>
                              )}
                              {isTaper && (
                                <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">TAPER</span>
                              )}
                              {isTestDay && (
                                <span className="px-2 py-1 bg-orange-600 text-white text-xs font-bold rounded animate-pulse">TEST DAY</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{completionRateLocal}%</div>
                            <div className="text-xs text-gray-500">{completed.length}/{tasks.length} done</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {tasks.map((task, idx) => {
                            const isCompleted = completed.includes(idx);
                            return (
                              <div
                                key={idx}
                                onClick={() => {
                                  const currentProgress = dailyProgress[date] || [];
                                  const newProgress = currentProgress.includes(idx)
                                    ? currentProgress.filter(i => i !== idx)
                                    : [...currentProgress, idx];
                                  setDailyProgress({ ...dailyProgress, [date]: newProgress });
                                }}
                                className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                                  isCompleted
                                    ? 'bg-green-100 border-green-300'
                                    : 'bg-white border-gray-200 hover:border-blue-300'
                                }`}
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                                ) : (
                                  <Circle className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                )}
                                <span
                                  className={`text-sm ${
                                    isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                                  }`}
                                >
                                  {task}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Today's Tasks Tab */}
            {activeTab === 'today' && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Today's Schedule</h2>
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400 mr-3 flex-shrink-0" />
                      )}
                      <span
                        className={`text-lg ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
                {todayTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No tasks scheduled for today</p>
                  </div>
                )}
              </div>
            )}

            {/* Score Tracker Tab */}
            {activeTab === 'scores' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Full-Length Scores</h2>
                  <button
                    onClick={addFL}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add FL
                  </button>
                </div>

                <div className="space-y-4">
                  {flScores.map((fl, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                        <div>
                          <input
                            type="date"
                            value={fl.date}
                            onChange={(e) => updateFL(index, 'date', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={fl.exam}
                            onChange={(e) => updateFL(index, 'exam', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm font-semibold"
                            placeholder="Exam name"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">C/P</label>
                          <input
                            type="number"
                            value={fl.cp}
                            onChange={(e) => updateFL(index, 'cp', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">CARS</label>
                          <input
                            type="number"
                            value={fl.cars}
                            onChange={(e) => updateFL(index, 'cars', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">B/B</label>
                          <input
                            type="number"
                            value={fl.bb}
                            onChange={(e) => updateFL(index, 'bb', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 block mb-1">P/S</label>
                          <input
                            type="number"
                            value={fl.ps}
                            onChange={(e) => updateFL(index, 'ps', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg"
                            min="118"
                            max="132"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-gray-600">Total</div>
                            <div className="text-2xl font-bold text-blue-600">{fl.total}</div>
                          </div>
                          {index > 0 && (
                            <button
                              onClick={() => deleteFL(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Score Progress</h2>

                {/* Overall Progress */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Overall Improvement</h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">+{growth.total}</div>
                      <div className="text-xs text-gray-600 mt-1">Total</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">+{growth.cp}</div>
                      <div className="text-xs text-gray-600 mt-1">C/P</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-orange-600">+{growth.cars}</div>
                      <div className="text-xs text-gray-600 mt-1">CARS</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-purple-600">+{growth.bb}</div>
                      <div className="text-xs text-gray-600 mt-1">B/B</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-3xl font-bold text-pink-600">+{growth.ps}</div>
                      <div className="text-xs text-gray-600 mt-1">P/S</div>
                    </div>
                  </div>
                </div>

                {/* Section Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Current Section Scores</h3>
                  {[
                    { name: 'C/P', score: latestScore.cp, color: 'blue' },
                    { name: 'CARS', score: latestScore.cars, color: 'orange' },
                    { name: 'B/B', score: latestScore.bb, color: 'purple' },
                    { name: 'P/S', score: latestScore.ps, color: 'pink' }
                  ].map((section) => (
                    <div key={section.name} className="bg-white rounded-lg p-4 border-2 border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-800">{section.name}</span>
                        <span className="text-2xl font-bold text-gray-800">{section.score}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`${barColorClass[section.color]} h-3 rounded-full transition-all`}
                          style={{ width: `${((section.score - 118) / 14) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>118</span>
                        <span>132</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Goal Progress */}
                <div className="mt-6 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="flex items-center mb-4">
                    <Target className="w-6 h-6 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-800">Goal Progress</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {latestScore.total}</span>
                      <span>Target: {targetScore}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all"
                        style={{ width: `${(latestScore.total / targetScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {pointsNeeded > 0 
                        ? `${pointsNeeded} points to goal` 
                        : `Goal achieved! ${Math.abs(pointsNeeded)} points above target`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCATTracker;