import { createContext, useContext, useState } from 'react';

const IssueContext = createContext();

export const IssueProvider = ({ children }) => {
    const [issues, setIssues] = useState([
        { id: 1, title: 'Fan not working', location: 'Room 302', status: 'Pending', date: '2024-03-10', priority: 'High', description: 'The ceiling fan in my room is making a loud noise and rotating very slowly.' },
        { id: 2, title: 'Water leakage', location: 'Bathroom 2 (2nd Floor)', status: 'Resolved', date: '2024-03-08', priority: 'Medium', description: 'Continuous water dripping from the tap.' },
        { id: 3, title: 'Broken Window Latch', location: 'Room 302', status: 'In Progress', date: '2024-03-05', priority: 'Low', description: 'Window latch is broken, unable to close window properly.' },
        { id: 4, title: 'Internet slow', location: 'Room 302', status: 'Pending', date: '2024-03-12', priority: 'Medium', description: 'Wi-Fi signal is very weak in this corner of the room.' },
    ]);

    const addIssue = (newIssue) => {
        const issue = {
            id: Date.now(),
            status: 'Pending',
            date: new Date().toISOString().split('T')[0],
            priority: 'Medium', // Default priority
            ...newIssue
        };
        setIssues([issue, ...issues]);
    };

    const getStats = () => {
        const total = issues.length;
        const pending = issues.filter(i => i.status === 'Pending').length;
        const resolved = issues.filter(i => i.status === 'Resolved').length;
        return { total, pending, resolved };
    };

    return (
        <IssueContext.Provider value={{ issues, addIssue, getStats }}>
            {children}
        </IssueContext.Provider>
    );
};

export const useIssues = () => useContext(IssueContext);
