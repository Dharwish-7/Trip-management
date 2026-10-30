import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Compass,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ShieldCheck,
  User,
  LogOut,
  PlusCircle,
  FolderOpen,
  ArrowRightLeft
} from 'lucide-react';

export const Navbar = ({ activeView, setActiveView, onOpenCreateTrip }) => {
  const { user, isOfficial, isTraveler, logout, switchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView(isOfficial ? 'govt-trips' : 'my-trips')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Compass className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                TripFlow
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                GK Backlog
              </span>
            </div>
          </div>

          {/* Navigation Links based on Role */}
          <nav className="hidden md:flex items-center space-x-1">
            {isTraveler && (
              <>
                <button
                  onClick={() => setActiveView('my-trips')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeView === 'my-trips'
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>My Trips & History</span>
                </button>

                <button
                  onClick={onOpenCreateTrip}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sm transition ml-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Create Trip</span>
                </button>
              </>
            )}

            {isOfficial && (
              <>
                <button
                  onClick={() => setActiveView('govt-trips')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeView === 'govt-trips'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Submitted Trips (GK-16, 17)</span>
                </button>

                <button
                  onClick={() => setActiveView('govt-destinations')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeView === 'govt-destinations'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Destinations (GK-19)</span>
                </button>

                <button
                  onClick={() => setActiveView('govt-activity')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeView === 'govt-activity'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Activity by Date (GK-20)</span>
                </button>

                <button
                  onClick={() => setActiveView('govt-gallery')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    activeView === 'govt-gallery'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  <span>Photos Audit (GK-21)</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action: Role Switcher & User Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick Demo Role Switcher */}
            <button
              onClick={() => {
                const nextRole = isOfficial ? 'traveler' : 'official';
                switchRole(nextRole);
                setActiveView(nextRole === 'official' ? 'govt-trips' : 'my-trips');
              }}
              title="Click to switch instantly between Traveler and Government view"
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-sky-600" />
              <span>Switch to {isOfficial ? 'Traveler' : 'Govt Official'}</span>
            </button>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center space-x-2 border-l border-slate-200 pl-3">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isOfficial
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isOfficial ? 'Govt Authority' : 'Traveler'}
              </span>
              <span className="text-sm font-medium text-slate-700 hidden lg:inline">
                {user?.name}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Log out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
