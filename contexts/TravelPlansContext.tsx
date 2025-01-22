import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TravelPlan } from "@/types/chat";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  messages: any[];
  createdAt: string;
}

interface TravelPlansContextType {
  plans: TravelPlan[];
  chats: ChatSession[];
  addPlan: (plan: TravelPlan) => Promise<void>;
  removePlan: (planId: string) => Promise<void>;
  addChat: (chat: Omit<ChatSession, "id" | "createdAt">) => Promise<string>;
  updateChat: (chatId: string, messages: any[]) => Promise<void>;
  removeChat: (chatId: string) => Promise<void>;
  getChatById: (chatId: string) => ChatSession | undefined;
}

const TravelPlansContext = createContext<TravelPlansContextType | undefined>(
  undefined
);

export function TravelPlansProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [chats, setChats] = useState<ChatSession[]>([]);

  useEffect(() => {
    loadPlans();
    loadChats();
  }, []);

  async function loadPlans() {
    try {
      const storedPlans = await AsyncStorage.getItem("travelPlans");
      if (storedPlans) {
        setPlans(JSON.parse(storedPlans));
      }
    } catch (error) {
      console.error("Error loading plans:", error);
    }
  }

  async function loadChats() {
    try {
      const storedChats = await AsyncStorage.getItem("chatSessions");
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
    } catch (error) {
      console.error("Error loading chats:", error);
    }
  }

  async function addChat(chat: Omit<ChatSession, "id" | "createdAt">) {
    try {
      const newChat: ChatSession = {
        ...chat,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedChats = [newChat, ...chats];
      await AsyncStorage.setItem("chatSessions", JSON.stringify(updatedChats));
      setChats(updatedChats);
      return newChat.id;
    } catch (error) {
      console.error("Error saving chat:", error);
      return "";
    }
  }

  async function updateChat(chatId: string, messages: any[]) {
    try {
      const updatedChats = chats.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages,
            lastMessage: messages[0]?.text || chat.lastMessage,
          };
        }
        return chat;
      });
      await AsyncStorage.setItem("chatSessions", JSON.stringify(updatedChats));
      setChats(updatedChats);
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  }

  async function removeChat(chatId: string) {
    try {
      const updatedChats = chats.filter((chat) => chat.id !== chatId);
      await AsyncStorage.setItem("chatSessions", JSON.stringify(updatedChats));
      setChats(updatedChats);
    } catch (error) {
      console.error("Error removing chat:", error);
    }
  }

  function getChatById(chatId: string) {
    return chats.find((chat) => chat.id === chatId);
  }

  async function addPlan(plan: TravelPlan) {
    try {
      const newPlan = {
        ...plan,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      const updatedPlans = [newPlan, ...plans];
      await AsyncStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  }

  async function removePlan(planId: string) {
    try {
      const updatedPlans = plans.filter((plan) => plan.id !== planId);
      await AsyncStorage.setItem("travelPlans", JSON.stringify(updatedPlans));
      setPlans(updatedPlans);
    } catch (error) {
      console.error("Error removing plan:", error);
    }
  }

  return (
    <TravelPlansContext.Provider
      value={{
        plans,
        chats,
        addPlan,
        removePlan,
        addChat,
        updateChat,
        removeChat,
        getChatById,
      }}
    >
      {children}
    </TravelPlansContext.Provider>
  );
}

export function useTravelPlans() {
  const context = useContext(TravelPlansContext);
  if (context === undefined) {
    throw new Error("useTravelPlans must be used within a TravelPlansProvider");
  }
  return context;
}
