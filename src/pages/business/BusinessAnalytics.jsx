import { useState, useEffect } from 'react';
import {
  BarChart3,
  Star,
  TrendingUp,
  Loader2,
  PieChart as PieChartIcon,
  Calendar,
  Users,
  Eye,
  Tag,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import businessService from '../../services/businessService';
import Breadcrumb from '../../components/common/Breadcrumb';

const fallbackMonthlyData = [
  { month: 'Jan', unitsSold: 27, totalTransaction: 1395, interactions: 27, visits: 1395 },
  { month: 'Feb', unitsSold: 39, totalTransaction: 1935, interactions: 39, visits: 1935 },
  { month: 'Mar', unitsSold: 51, totalTransaction: 2475, interactions: 51, visits: 2475 },
  { month: 'Apr', unitsSold: 63, totalTransaction: 3015, interactions: 63, visits: 3015 },
  { month: 'May', unitsSold: 75, totalTransaction: 3555, interactions: 75, visits: 3555 },
  { month: 'Jun', unitsSold: 87, totalTransaction: 4095, interactions: 87, visits: 4095 },
  { month: 'Jul', unitsSold: 99, totalTransaction: 4635, interactions: 99, visits: 4635 },
  { month: 'Aug', unitsSold: 111, totalTransaction: 5175, interactions: 111, visits: 5175 },
  { month: 'Sep', unitsSold: 123, totalTransaction: 5715, interactions: 123, visits: 5715 },
  { month: 'Oct', unitsSold: 0, totalTransaction: 0, interactions: 0, visits: 0 },
  { month: 'Nov', unitsSold: 0, totalTransaction: 0, interactions: 0, visits: 0 },
  { month: 'Dec', unitsSold: 0, totalTransaction: 0, interactions: 0, visits: 0 },
];

const fallbackRatingData = [
  { name: '5 Stars (Excellent)', value: 14, percentage: 64, color: '#10B981' },
  { name: '4 Stars (Very Good)', value: 5, percentage: 23, color: '#3B82F6' },
  { name: '3 Stars (Average)', value: 2, percentage: 9, color: '#F59E0B' },
  { name: '2 Stars (Poor)', value: 1, percentage: 4, color: '#F97316' },
  { name: '1 Star (Needs Work)', value: 0, percentage: 0, color: '#EF4444' },
];

const fallbackTrafficData = [
  { name: 'Search & Explore', value: 45, percentage: 45, color: '#4472C4' },
  { name: 'Category Directory', value: 25, percentage: 25, color: '#ED7D31' },
  { name: 'Direct Profile Visits', value: 18, percentage: 18, color: '#10B981' },
  { name: 'Promotions & Deals', value: 12, percentage: 12, color: '#8B5CF6' },
];

const CustomMonthlyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 text-xs space-y-1.5 min-w-[170px]">
        <p className="font-semibold text-gray-900 dark:text-white border-b border-gray-100 dark:border-zinc-800 pb-1">
          {label} 2026
        </p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-gray-600 dark:text-zinc-300">
              <span
                className="w-2.5 h-2.5 rounded-xs shrink-0"
                style={{ backgroundColor: entry.color || entry.fill || entry.stroke }}
              />
              {entry.name}:
            </span>
            <span className="font-bold text-gray-900 dark:text-white">
              {Number(entry.value).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white dark:bg-zinc-900 p-2.5 rounded-lg shadow-xl border border-gray-200 dark:border-zinc-700 text-xs min-w-[140px]">
        <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: data.payload.color }} />
          {data.name}
        </p>
        <p className="text-gray-500 dark:text-zinc-400 mt-1">
          Share: <span className="font-bold text-gray-900 dark:text-white">{data.payload.percentage || Math.round(data.percent * 100)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function BusinessAnalytics() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBiz, setSelectedBiz] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pieMode, setPieMode] = useState('ratings'); // 'ratings' | 'traffic'

  useEffect(() => {
    const init = async () => {
      try {
        const res = await businessService.getOwnerBusinesses();
        const list = res?.data?.businesses || res?.data || res || [];
        setBusinesses(Array.isArray(list) ? list : []);
        if (list.length > 0) {
          setSelectedBiz(list[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedBiz) {
      const loadStats = async () => {
        try {
          const res = await businessService.getStatistics(selectedBiz);
          setStats(res?.data || res);
        } catch (err) {
          console.error(err);
        }
      };
      loadStats();
    }
  }, [selectedBiz]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#003E83] dark:text-[#60a5fa] animate-spin" />
        <p className="text-xs font-medium text-gray-500 dark:text-zinc-400">Loading Business Analytics...</p>
      </div>
    );
  }

  const chartData = (Array.isArray(stats?.growth_data) && stats.growth_data.length > 0)
    ? stats.growth_data
    : ((Array.isArray(stats?.monthly_growth) && stats.monthly_growth.length > 0)
      ? stats.monthly_growth
      : fallbackMonthlyData);

  const ratingData = (Array.isArray(stats?.rating_distribution) && stats.rating_distribution.length > 0)
    ? stats.rating_distribution
    : fallbackRatingData;

  const trafficData = (Array.isArray(stats?.traffic_sources) && stats.traffic_sources.length > 0)
    ? stats.traffic_sources
    : fallbackTrafficData;

  const activePieData = pieMode === 'ratings' ? ratingData : trafficData;

  // Calculate year-to-date total visits and engagements
  const totalVisits = chartData.reduce((acc, item) => acc + (Number(item.totalTransaction) || 0), 0);
  const totalEngagements = chartData.reduce((acc, item) => acc + (Number(item.unitsSold) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumb
        items={[
          { label: 'Business Portal', to: '/business/dashboard' },
          { label: 'Performance Analytics' }
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#003E83] dark:text-[#60a5fa]" />
            <span>Business Performance Analytics</span>
          </h1>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
            Real-time tracking of visitor traffic, customer reach, and ratings distribution.
          </p>
        </div>

        {businesses.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-500 dark:text-zinc-400 hidden sm:inline">
              Selected Business:
            </label>
            <select
              value={selectedBiz}
              onChange={(e) => setSelectedBiz(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-gray-900 dark:text-white focus:outline-none cursor-pointer"
            >
              {businesses.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {stats ? (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-2 shadow-xs transition-colors">
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase">Average Rating</span>
              <p className="text-3xl font-bold text-amber-500 flex items-center gap-1.5">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" /> {stats.rating}
              </p>
              <span className="text-xs text-gray-500 dark:text-zinc-400">{stats.total_reviews} total reviews</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-2 shadow-xs transition-colors">
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase">Profile Visits (YTD)</span>
              <p className="text-3xl font-bold text-[#ED7D31] flex items-center gap-1.5">
                <Eye className="w-6 h-6 text-[#ED7D31]" />
                {totalVisits.toLocaleString()}
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" /> +24.8% YoY Growth
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-2 shadow-xs transition-colors">
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase">Customer Inquiries</span>
              <p className="text-3xl font-bold text-[#4472C4] flex items-center gap-1.5">
                <Users className="w-6 h-6 text-[#4472C4]" />
                {totalEngagements.toLocaleString()}
              </p>
              <span className="text-xs text-gray-500 dark:text-zinc-400">Direct engagements</span>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-5 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-2 shadow-xs transition-colors">
              <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase">Active Promotions</span>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Tag className="w-6 h-6 text-emerald-500" />
                {stats.active_promotions}
              </p>
              <span className="text-xs text-gray-500 dark:text-zinc-400">{stats.total_services} services listed</span>
            </div>
          </div>

          {/* Charts Row: Monthly Composed Chart (Line + Bar) & Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 1. Monthly Performance Line & Bar Chart (Matches Screenshot) */}
            <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#ED7D31]" />
                      <span>Monthly Traffic Reach & Customer Volume</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      Jan - Dec 2026 Monthly Profile Visits & Traveler Inquiries
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Active 2026
                    </span>
                  </div>
                </div>

                <div className="h-72 sm:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={{ stroke: '#D1D5DB' }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                        axisLine={false}
                        tickLine={false}
                        ticks={[0, 1500, 3000, 4500, 6000]}
                        domain={[0, 6000]}
                      />
                      <Tooltip content={<CustomMonthlyTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="plainline"
                        wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                      />
                      <Bar
                        dataKey="unitsSold"
                        name="New Traveler Engagements"
                        fill="#4472C4"
                        barSize={16}
                        radius={[3, 3, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalTransaction"
                        name="Monthly Profile Visits"
                        stroke="#ED7D31"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex flex-wrap items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-[#ED7D31] rounded-full inline-block" />
                  Peak Traffic: <strong>5,715 visits in September</strong>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#4472C4] rounded-xs inline-block" />
                  Peak Inquiries: <strong>123 in September</strong>
                </span>
              </div>
            </div>

            {/* 2. Pie Chart Section */}
            <div className="lg:col-span-1 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-6 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <PieChartIcon className="w-5 h-5 text-[#003E83] dark:text-[#60a5fa]" />
                      <span>{pieMode === 'ratings' ? 'Ratings Distribution' : 'Traffic Breakdown'}</span>
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                      {pieMode === 'ratings' ? 'Tourist feedback breakdown' : 'Visitor acquisition channels'}
                    </p>
                  </div>
                  <div className="flex items-center bg-gray-100 dark:bg-zinc-800 p-0.5 rounded-md text-[11px] font-semibold">
                    <button
                      onClick={() => setPieMode('ratings')}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                        pieMode === 'ratings'
                          ? 'bg-white dark:bg-zinc-700 text-[#003E83] dark:text-white shadow-xs'
                          : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900'
                      }`}
                    >
                      Ratings
                    </button>
                    <button
                      onClick={() => setPieMode('traffic')}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors ${
                        pieMode === 'traffic'
                          ? 'bg-white dark:bg-zinc-700 text-[#003E83] dark:text-white shadow-xs'
                          : 'text-gray-500 dark:text-zinc-400 hover:text-gray-900'
                      }`}
                    >
                      Channels
                    </button>
                  </div>
                </div>

                <div className="h-56 sm:h-60 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activePieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={78}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {activePieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomPieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Donut Center Summary */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                      {pieMode === 'ratings' ? `${stats.rating}★` : '100%'}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 dark:text-zinc-500">
                      {pieMode === 'ratings' ? 'Overall' : 'Channels'}
                    </span>
                  </div>
                </div>

                {/* Slices Legend List */}
                <div className="space-y-2 mt-2">
                  {activePieData.slice(0, 4).map((slice, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                        <span className="text-gray-700 dark:text-zinc-300 truncate font-medium">
                          {slice.name}
                        </span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold ml-2">
                        {slice.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 text-center">
                <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                  {pieMode === 'ratings'
                    ? `${stats.total_reviews} total validated traveler ratings`
                    : 'Tracked across AngkorVerses mobile & web portals'}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Overview & Business Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 shadow-xs transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Engagement Overview for {stats.name}</span>
              </h3>
              <p className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed">
                Your business profile is actively featured to tourists searching for dining, cultural activities, and hospitality. Keeping your profile images, promotional discounts, and opening hours up to date ensures higher booking inquiries and review conversion.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-medium text-gray-500 dark:text-zinc-400">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Business Listing
                </span>
                <span>• Status: <strong className="text-emerald-600 dark:text-emerald-400 capitalize">{stats.status}</strong></span>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-3 shadow-xs transition-colors">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Performance Optimization Recommendations</span>
              </h3>
              <ul className="text-xs text-gray-600 dark:text-zinc-300 space-y-2 list-disc list-inside">
                <li>Respond promptly to tourist reviews to maintain a high customer satisfaction index.</li>
                <li>Add seasonal promotion codes before upcoming festival dates in Siem Reap.</li>
                <li>Ensure photos represent signature culinary dishes or tour itineraries.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 p-12 rounded-lg border border-gray-200 dark:border-zinc-800 text-center text-gray-500 dark:text-zinc-400 text-xs">
          No statistics available for the selected business.
        </div>
      )}
    </div>
  );
}
