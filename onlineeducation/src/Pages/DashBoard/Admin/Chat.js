import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
    // State for active view (one-to-one or group)
    const [activeView, setActiveView] = useState('one-to-one');

    // State for selected contact/group
    const [selectedContact, setSelectedContact] = useState(0);
    const [selectedGroup, setSelectedGroup] = useState(0);

    // State for messages
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // State for typing indicator
    const [typingUsers, setTypingUsers] = useState([]);

    // State for search
    const [searchTerm, setSearchTerm] = useState('');

    // Ref for auto-scrolling
    const messagesEndRef = useRef(null);

    // Sample data
    const contacts = [
        { id: 1, name: 'Dr. Sarah Johnson', role: 'Professor', lastMessage: 'See you tomorrow!', time: '10:30 AM', unread: 2 },
        { id: 2, name: 'Alex Chen', role: 'Student', lastMessage: 'Thanks for the help!', time: 'Yesterday', unread: 0 },
        { id: 3, name: 'Prof. Michael Brown', role: 'Professor', lastMessage: 'Assignment due Friday', time: 'Yesterday', unread: 1 },
        { id: 4, name: 'Emily Rodriguez', role: 'Student', lastMessage: 'Can we schedule a meeting?', time: '2 days ago', unread: 0 },
        { id: 5, name: 'Dr. Lisa Wang', role: 'Teaching Assistant', lastMessage: 'Office hours today', time: '3 days ago', unread: 0 },
    ];

    const groups = [
        { id: 1, name: 'Computer Science 101', members: 24, lastMessage: 'Midterm review session', time: '11:45 AM', unread: 5 },
        { id: 2, name: 'Mathematics Study Group', members: 12, lastMessage: 'Problem set #3 solutions', time: 'Yesterday', unread: 0 },
        { id: 3, name: 'Project Team Alpha', members: 5, lastMessage: 'Design documents updated', time: '2 days ago', unread: 3 },
        { id: 4, name: 'Literature Discussion', members: 18, lastMessage: 'New reading assignment', time: '3 days ago', unread: 0 },
    ];

    // Sample messages for one-to-one chat
    const oneToOneMessages = [
        { id: 1, sender: 'Dr. Sarah Johnson', text: 'Hi there! I wanted to discuss your recent assignment.', time: '10:15 AM', isSelf: false },
        { id: 2, sender: 'You', text: 'Hello Dr. Johnson! I have some questions about the feedback.', time: '10:17 AM', isSelf: true },
        { id: 3, sender: 'Dr. Sarah Johnson', text: 'Of course! What specific areas would you like to clarify?', time: '10:18 AM', isSelf: false },
        { id: 4, sender: 'You', text: 'I\'m particularly confused about the optimization section. Could you explain it again?', time: '10:20 AM', isSelf: true },
        { id: 5, sender: 'Dr. Sarah Johnson', text: 'Sure, let me prepare some examples for our next meeting tomorrow at 2 PM.', time: '10:25 AM', isSelf: false },
    ];

    // Sample messages for group chat
    const groupMessages = [
        { id: 1, sender: 'Alex Chen', text: 'Has anyone started working on the project?', time: '10:30 AM', color: 'bg-blue-500' },
        { id: 2, sender: 'You', text: 'I\'ve completed the research part. Working on the design now.', time: '10:32 AM', color: 'bg-purple-500' },
        { id: 3, sender: 'Emily Rodriguez', text: 'Great! I can help with the implementation if needed.', time: '10:35 AM', color: 'bg-green-500' },
        { id: 4, sender: 'Prof. Michael Brown', text: 'Remember to submit your progress reports by Friday.', time: '10:40 AM', color: 'bg-yellow-500' },
    ];

    // Initialize messages based on active view
    useEffect(() => {
        if (activeView === 'one-to-one') {
            setMessages(oneToOneMessages);
        } else {
            setMessages(groupMessages);
        }
    }, [activeView, selectedContact, selectedGroup]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending a new message
    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: messages.length + 1,
            sender: 'You',
            text: newMessage,
            time: 'Just now',
            isSelf: true,
            color: activeView === 'group' ? 'bg-purple-500' : ''
        };

        setMessages([...messages, newMsg]);
        setNewMessage('');

        // Simulate typing indicator
        if (activeView === 'group') {
            const randomUsers = ['Alex Chen', 'Emily Rodriguez', 'Prof. Michael Brown'];
            const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
            setTypingUsers([randomUser]);

            // Clear typing indicator after 2 seconds
            setTimeout(() => {
                setTypingUsers([]);
            }, 2000);
        }
    };

    // Filter contacts based on search term
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter groups based on search term
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            {/* Header */}
            <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center">
                    <button
                        onClick={() => setActiveView('one-to-one')}
                        className={`px-4 py-2 rounded-l-lg ${activeView === 'one-to-one' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        One-to-One
                    </button>
                    <button
                        onClick={() => setActiveView('group')}
                        className={`px-4 py-2 rounded-r-lg ${activeView === 'group' ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        Group Chat
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-xl font-bold">EduChat</div>
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                        U
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-700">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>

                    {/* Contact/Group List */}
                    <div className="flex-1 overflow-y-auto">
                        {activeView === 'one-to-one' ? (
                            <div>
                                {filteredContacts.map((contact) => (
                                    <div
                                        key={contact.id}
                                        className={`flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${selectedContact === contact.id ? 'bg-gray-700' : ''}`}
                                        onClick={() => setSelectedContact(contact.id)}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div className="font-semibold">{contact.name}</div>
                                                <div className="text-xs text-gray-400">{contact.time}</div>
                                            </div>
                                            <div className="text-sm text-gray-400 flex justify-between">
                                                <span>{contact.lastMessage}</span>
                                                {contact.unread > 0 && (
                                                    <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                            {contact.unread}
                          </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                {filteredGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className={`flex items-center p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${selectedGroup === group.id ? 'bg-gray-700' : ''}`}
                                        onClick={() => setSelectedGroup(group.id)}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div className="font-semibold">{group.name}</div>
                                                <div className="text-xs text-gray-400">{group.time}</div>
                                            </div>
                                            <div className="text-sm text-gray-400 flex justify-between">
                                                <span>{group.lastMessage}</span>
                                                <div className="flex items-center">
                                                    <span className="text-xs mr-2">{group.members} members</span>
                                                    {group.unread > 0 && (
                                                        <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                              {group.unread}
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-gray-800 p-4 border-b border-gray-700 flex items-center">
                        {activeView === 'one-to-one' ? (
                            <>
                                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                    {contacts.find(c => c.id === selectedContact)?.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-semibold">{contacts.find(c => c.id === selectedContact)?.name}</div>
                                    <div className="text-xs text-gray-400">{contacts.find(c => c.id === selectedContact)?.role}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center mr-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <div className="font-semibold">{groups.find(g => g.id === selectedGroup)?.name}</div>
                                    <div className="text-xs text-gray-400">{groups.find(g => g.id === selectedGroup)?.members} members</div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-900">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.isSelf ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.isSelf ? 'bg-purple-600 rounded-tr-none' :
                                            activeView === 'group' ? message.color + ' rounded-tl-none' : 'bg-gray-700 rounded-tr-none'}`}
                                    >
                                        {activeView === 'group' && !message.isSelf && (
                                            <div className="font-semibold text-xs mb-1">{message.sender}</div>
                                        )}
                                        <div>{message.text}</div>
                                        <div className={`text-xs mt-1 ${message.isSelf ? 'text-purple-200' : 'text-gray-400'}`}>
                                            {message.time}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {typingUsers.length > 0 && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-700 px-4 py-2 rounded-2xl rounded-tl-none">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {typingUsers.join(', ')} is typing...
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="bg-gray-800 p-4 border-t border-gray-700">
                        <div className="flex items-center">
                            <button className="p-2 text-gray-400 hover:text-white mr-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                            </button>
                            <button className="p-2 text-gray-400 hover:text-white mr-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </button>
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-700 text-white rounded-full py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                className="ml-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 flex items-center justify-center"
                                onClick={handleSendMessage}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;