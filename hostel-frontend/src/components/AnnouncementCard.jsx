import { Megaphone, Drumstick, Wifi, AlertTriangle } from 'lucide-react';

const AnnouncementCard = ({ title, date, type, content }) => {
    let Icon = Megaphone;
    let colorClass = "text-indigo-400 bg-indigo-500/10 border-indigo-500/20";

    if (type === 'food') { Icon = Drumstick; colorClass = "text-orange-400 bg-orange-500/10 border-orange-500/20"; }
    else if (type === 'success') { Icon = Wifi; colorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"; }
    else if (type === 'warning') { Icon = AlertTriangle; colorClass = "text-amber-400 bg-amber-500/10 border-amber-500/20"; }

    return (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800 transition-colors group">
            <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={16} />
                </div>
                <span className="text-xs text-slate-500">{date}</span>
            </div>
            <h4 className="text-white font-medium mb-1 group-hover:text-indigo-300 transition-colors">{title}</h4>
            <p className="text-slate-400 text-xs leading-relaxed">{content}</p>
        </div>
    );
};

export default AnnouncementCard;
