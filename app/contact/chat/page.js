"use client";
import { useState, useEffect } from 'react';
import { MessageCircle, Send, Smile, Paperclip, Phone, Video, MoreVertical } from 'lucide-react';

export default function LiveChatPage() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [agentInfo, setAgentInfo] = useState({
        name: 'Sarah Wilson',
        role: 'Customer Support Specialist',
        status: 'online'
    });

    useEffect(() => {
        // Simulate connecting to chat
        setTimeout(() => {
            setIsConnected(true);
            setMessages([
                {
                    id: 1,
                    sender: 'agent',
                    message: `Hello! I'm ${agentInfo.name}, your customer support specialist. How can I help you today?`,
                    timestamp: new Date(),
                    type: 'text'
                }
            ]);
        }, 2000);
    }, [agentInfo.name]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const userMessage = {
            id: messages.length + 1,
            sender: 'user',
            message: newMessage,
            timestamp: new Date(),
            type: 'text'
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');

        // Simulate agent typing
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const agentResponse = {
                id: messages.length + 2,
                sender: 'agent',
                message: getAgentResponse(newMessage),
                timestamp: new Date(),
                type: 'text'
            };
            setMessages(prev => [...prev, agentResponse]);
        }, 2000);
    };

    const getAgentResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "I'd be happy to help you with pricing information! Could you tell me which specific products or services you're interested in? We have LED displays, video walls, and rental packages available.";
        } else if (lowerMessage.includes('rental')) {
            return "Great! We offer several rental options including short-term (daily), monthly, event packages, and corporate rentals. What type of event or duration are you looking for?";
        } else if (lowerMessage.includes('technical') || lowerMessage.includes('support')) {
            return "For technical support, I can help with basic questions, or I can connect you with our technical team if needed. What specific issue are you experiencing?";
        } else if (lowerMessage.includes('delivery')) {
            return "We offer delivery and professional installation services. Delivery is typically available within 24-48 hours for most areas. What's your location and when do you need the equipment?";
        } else {
            return "Thank you for your message! I'm here to help with any questions about our LED displays, rentals, technical support, or general inquiries. Could you provide a bit more detail about what you're looking for?";
        }
    };

    const quickReplies = [
        "Product pricing",
        "Rental options",
        "Technical support",
        "Delivery information",
        "Custom quote"
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-green-600/20 rounded-xl border border-green-500/30">
                                <MessageCircle className="w-8 h-8 text-green-400" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-4 font-space">Live Chat Support</h1>
                        <p className="text-gray-300 font-inter">
                            Get instant help from our customer support team
                        </p>
                    </div>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                    {/* Chat Header */}
                    <div className="p-4 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-bold text-white">{agentInfo.name.split(' ').map(n => n[0]).join('')}</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold font-outfit">{agentInfo.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${agentInfo.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                                        <span className="text-sm text-gray-400 font-inter">{agentInfo.role}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                    <Phone className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                    <Video className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Connection Status */}
                    {!isConnected && (
                        <div className="p-4 bg-blue-600/20 border-b border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-blue-400 font-inter">Connecting you to an agent...</span>
                            </div>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-100'
                                    }`}>
                                    <p className="font-inter">{message.message}</p>
                                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 px-4 py-2 rounded-lg">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Replies */}
                    {isConnected && messages.length === 1 && (
                        <div className="p-4 border-t border-gray-700">
                            <p className="text-sm text-gray-400 mb-3 font-inter">Quick questions:</p>
                            <div className="flex flex-wrap gap-2">
                                {quickReplies.map((reply, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setNewMessage(reply)}
                                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-sm rounded-full border border-gray-600 transition-colors font-inter"
                                    >
                                        {reply}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-700">
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message..."
                                    disabled={!isConnected}
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none font-inter"
                                />
                            </div>
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg">
                                <Smile className="w-5 h-5" />
                            </button>
                            <button
                                onClick={sendMessage}
                                disabled={!newMessage.trim() || !isConnected}
                                className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Info */}
                <div className="mt-6 p-4 bg-gray-900 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold mb-4 font-outfit">Chat Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-gray-400 font-inter">Average Response Time:</span>
                            <div className="text-green-400 font-semibold font-inter">Under 2 minutes</div>
                        </div>
                        <div>
                            <span className="text-gray-400 font-inter">Availability:</span>
                            <div className="text-white font-inter">9 AM - 6 PM EST</div>
                        </div>
                        <div>
                            <span className="text-gray-400 font-inter">Languages:</span>
                            <div className="text-white font-inter">English, Spanish</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
