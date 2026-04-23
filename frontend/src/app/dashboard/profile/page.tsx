"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TabBar } from '@/components/dashboard/TabBar';
import { User, LogOut, Mail, Calendar, Shield, Sparkles, Settings, Edit2, Check, X, Target, UserCircle, Activity, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useAssessmentStore } from '@/store/assessmentStore';

// ─── Reusable Components (Defined outside to prevent focus loss) ──────────────

const InfoCard = ({ icon: Icon, tag, value, bg, color, editable, onChange, type = "text", isEditing }: any) => (
    <div className="bg-white rounded-[32px] p-6 shadow-[0_4px_20px_rgba(75,52,37,0.04)] border border-white flex items-center gap-5 transition-all">
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shadow-inner shrink-0`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#4F3422]/40 font-black uppercase tracking-widest mb-1">{tag}</p>
            {isEditing && editable ? (
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-[#4F3422]/10 outline-none text-[#4F3422] font-black text-lg tracking-tight focus:border-[#9BB068] transition-colors"
                />
            ) : (
                <p className="text-[#4F3422] font-black text-lg tracking-tight truncate">{value || 'Not set'}</p>
            )}
        </div>
    </div>
);

export default function ProfilePage() {
    const router = useRouter();
    const { user, token, logout, updateProfile } = useAuthStore();
    const { fetchLatest, goal, age, updateAssessment } = useAssessmentStore();

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editGoal, setEditGoal] = useState('');
    const [editAge, setEditAge] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!token) {
            router.push('/login');
        } else {
            fetchLatest();
        }
    }, [token, router, fetchLatest]);

    useEffect(() => {
        if (user) {
            setEditName(user.name);
            setEditEmail(user.email);
        }
        if (goal) setEditGoal(goal);
        if (age) setEditAge(age);
    }, [user, goal, age, isEditing]); // Reset when entering edit mode

    if (!token || !user) return null;

    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const profileSuccess = await updateProfile({ 
                name: editName,
                email: editEmail
            });
            const assessmentSuccess = await updateAssessment({ 
                goal: editGoal, 
                age: Number(editAge) 
            });
            
            if (profileSuccess || assessmentSuccess) {
                setIsEditing(false);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
            {/* Header with Decorative Elements */}
            <div className="bg-[#4F3422] rounded-b-[3rem] px-6 pt-12 pb-12 text-white shadow-lg relative z-10 overflow-hidden">
                <img src="/assets/Journal_assets/bg.svg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none select-none z-0" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                            <Sparkles className="w-3 h-3 text-[#9BB068]" />
                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Profile Center</span>
                        </div>
                        <button 
                            onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                            className={`w-10 h-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md active:scale-95 transition-all ${isEditing ? 'bg-red-500/20 text-red-200' : 'bg-white/10 text-white'}`}
                        >
                             {isEditing ? <X className="w-5 h-5" /> : <Edit2 className="w-4 h-4" />}
                        </button>
                    </div>
                    
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">Account & Wellness</p>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-2">Profile</h1>
                    <p className="text-white/60 font-bold text-sm">Personalize your Unwind experience</p>
                </div>
            </div>

            {/* Profile Content */}
            <div className="flex-1 px-6 pt-10 pb-32 -mt-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-8"
                >
                    {/* Avatar Group */}
                    <div className="relative">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-white p-2 shadow-[0_20px_40px_rgba(75,52,37,0.08)] relative z-10 border border-gray-50">
                             <div className="w-full h-full rounded-[2rem] bg-[#E8DDD9] flex items-center justify-center relative">
                                 <span className="text-[#4F3422] font-black text-5xl tracking-tighter">{initials}</span>
                                 <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[#9BB068] rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                                     <Shield className="w-4 h-4 text-white" strokeWidth={3} />
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* Name Section */}
                    <div className="text-center w-full px-4">
                        {isEditing ? (
                            <div className="flex flex-col items-center gap-2">
                                <label className="text-[10px] text-[#4F3422]/30 font-black uppercase tracking-widest">Full Name</label>
                                <input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="text-3xl font-black text-[#4F3422] tracking-tight text-center bg-transparent border-b-4 border-[#4F3422]/5 outline-none focus:border-[#9BB068] transition-colors w-full"
                                    autoFocus
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-black text-[#4F3422] tracking-tight">{user.name}</h2>
                                <div className="mt-2 flex items-center justify-center gap-2">
                                     <div className="w-2 h-2 rounded-full bg-[#9BB068]" />
                                     <p className="text-[#926247] font-black uppercase tracking-widest text-[10px] opacity-60">Premium Member</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Info Cards Grid */}
                    <div className="w-full max-w-sm flex flex-col gap-4 mt-2">
                        <InfoCard 
                            icon={Mail} 
                            tag="Email Address" 
                            value={isEditing ? editEmail : user.email} 
                            bg="bg-[#f0efff]" 
                            color="text-[#A28FFF]" 
                            editable={true} 
                            onChange={setEditEmail}
                            isEditing={isEditing}
                        />
                        
                        <InfoCard 
                            icon={Target} 
                            tag="Personal Goal" 
                            value={isEditing ? editGoal : goal} 
                            bg="bg-[#fff0eb]" 
                            color="text-[#FE814B]" 
                            editable={true} 
                            onChange={setEditGoal}
                            isEditing={isEditing}
                        />

                        <InfoCard 
                            icon={UserCircle} 
                            tag="Age" 
                            value={isEditing ? editAge : age} 
                            bg="bg-[#f2f8eb]" 
                            color="text-[#9BB068]" 
                            editable={true} 
                            type="number"
                            onChange={setEditAge}
                            isEditing={isEditing}
                        />

                        {!isEditing && (
                            <InfoCard 
                                icon={Calendar} 
                                tag="Member Since" 
                                value={new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} 
                                bg="bg-gray-50" 
                                color="text-gray-400" 
                                editable={false} 
                                isEditing={isEditing}
                            />
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full max-w-sm pt-4 flex flex-col gap-4">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.button
                                    key="save"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={handleUpdate}
                                    disabled={isUpdating}
                                    className="w-full h-16 bg-[#4F3422] text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                                >
                                    {isUpdating ? (
                                        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Check className="w-6 h-6" strokeWidth={3} /> Save Changes
                                        </>
                                    )}
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="logout"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="w-full h-16 bg-[#FE814B] text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-[0_12px_24px_rgba(254,129,75,0.2)] hover:bg-[#ff7135] transition-all active:scale-95 border-b-4 border-[#e06b3a]"
                                >
                                    <LogOut className="w-5 h-5" strokeWidth={3} /> Sign Out Account
                                </motion.button>
                            )}
                        </AnimatePresence>
                        
                        <p className="text-center text-[10px] font-black text-[#4F3422]/30 uppercase tracking-widest mt-2 px-4 leading-relaxed">
                            Secured and encrypted session. <br/> Version 2.5.2 High-Fidelity
                        </p>
                    </div>
                </motion.div>
            </div>

            <TabBar />
        </div>
    );
}
