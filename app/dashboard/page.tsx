"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { twMerge } from "tailwind-merge";
import { MotionConfig, motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import WetPaintButton from "../components/DripButton";
import CreateBotModal from "../components/CreateBotModal";
import { getInviteLink } from "../../bot/discordBot";
const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [botName, setBotName] = useState("");
  const [botPrompt, setBotPrompt] = useState("");
  const [botLink, setBotLink] = useState("");
  const [botToken, setBotToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [bots, setBots] = useState([]);
  console.log(bots);

  const Card = ({
    inviteLink,
    title,
    subtitle,
    className,
    botToken,
    botId,
    status,
    handleStartBot,
  }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [keywords, setKeywords] = useState("");
    const [leads, setLeads] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    return (
      <MotionConfig
        transition={{
          type: "spring",
          bounce: 0.5,
        }}
      >
        <motion.div
          whileHover="hovered"
          className={twMerge(
            "group w-full border-2 border-black bg-emerald-300",
            className
          )}
        >
          <motion.div
            initial={{
              x: 0,
              y: 0,
            }}
            variants={{
              hovered: {
                x: -8,
                y: -8,
              },
            }}
            className={twMerge(
              "-m-0.5 border-2 border-black bg-emerald-300",
              className
            )}
          >
            <motion.div
              initial={{
                x: 0,
                y: 0,
              }}
              variants={{
                hovered: {
                  x: -8,
                  y: -8,
                },
              }}
              className={twMerge(
                "relative -m-0.5 flex h-72 flex-col justify-between overflow-hidden border-2 border-black bg-emerald-300 p-8",
                className
              )}
            >
              <p className="flex items-center text-2xl font-medium uppercase">
                <FiArrowRight className="-ml-8 mr-2 opacity-0 transition-all duration-300 ease-in-out group-hover:ml-0 group-hover:opacity-100" />
                {title}
              </p>
              <div>
                <p className="transition-[margin] duration-300 ease-in-out group-hover:mb-1">
                  <strong>Prompt:</strong> {subtitle}
                </p>
                <p className="transition-[margin] duration-300 ease-in-out group-hover:mb-20">
                  <strong className="whitespace-nowrap">Invite Link:</strong>
                  <a
                    href={inviteLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {inviteLink}
                  </a>
                </p>

                <button
                  className="absolute bottom-2 left-2 right-2 translate-y-full border-2 border-black bg-white px-4 py-2 text-black opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100"
                  onClick={() =>
                    handleStartBot(botId, title, subtitle, botToken)
                  } // Passing values here
                >
                  Start Bot
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Modal for keyword input and lead display */}
        {isModalVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-blue-300 p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Enter Keywords</h3>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-gray-300 rounded-md mb-4"
                placeholder="Enter keywords separated by commas"
              />
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsModalVisible(false)}
                  className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-400 rounded-md hover:bg-blue-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Generating..." : "Generate"}
                </button>
              </div>

              {/* Display leads */}
              {leads.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    Generated Leads:
                  </h4>
                  <ul className="list-disc pl-5">
                    {leads.map((lead, index) => (
                      <li key={index} className="mb-2">
                        <strong>Keyword:</strong> {lead.keyword}
                        <br />
                        <strong>Message:</strong> {lead.message}
                        <br />
                        <strong>Author:</strong> {lead.author}
                        <br />
                        <strong>Channel:</strong> {lead.channel}
                        <br />
                        <strong>Guild:</strong> {lead.guild}
                        <br />
                        <strong>Timestamp:</strong>{" "}
                        {new Date(lead.timestamp).toLocaleString()}
                        <br />
                        <strong>Channel Type:</strong> {lead.channelType}
                        <br />
                        {lead.threadName && (
                          <>
                            <strong>Thread Name:</strong> {lead.threadName}
                            <br />
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </MotionConfig>
    );
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserBots();
    }
  }, [user]);

  const fetchUserBots = async () => {
    try {
      const response = await axios.get(`/api/user-bots?userId=${user.id}`);
      setBots(response.data.bots);
      console.log(response.data.bots);
    } catch (err) {
      console.error("Failed to fetch user bots:", err);
      setError("Error retrieving user bots.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    let inviteLink = ""; // Declare inviteLink outside of the try blocks to ensure it's accessible

    try {
      const res = await fetch("/api/inviteBot", {
        method: "POST",
        body: JSON.stringify({ token: botToken }),
      });
      const data = await res.json();
      inviteLink = data.inviteLink;
    } catch (err) {
      setError("Failed to get invite link. Please try again.");
      setIsLoading(false); // Stop loading if invite link fails
      return; // Early return if invite link request fails
    }

    try {
      const response = await axios.post("/api/create-bot", {
        name: botName,
        prompt: botPrompt,
        id: user.id,
        discordToken: botToken,
        inviteLink: inviteLink,
      });
      setBotLink(response.data.bot.invite_link);
      fetchUserBots(); // Refresh the bot list after creating a new bot
    } catch (err) {
      setError("Failed to create bot. Please try again.");
    } finally {
      setIsLoading(false); // Ensure loading state is stopped after the whole process
    }
  };

  const handleStartBot = async (botId, botName, botPrompt, botToken) => {
    const body = {
      botId: botId,
      prompt: botPrompt,
      name: botName,
      discordToken: botToken,
    };

    try {
      const res = await fetch("/api/startBot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add this to ensure JSON is properly handled
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      console.log(data); // Handle the response data here
      if (data.data.inviteLink) {
        setInviteLink(data.data.inviteLink);
      }
    } catch (error) {
      console.error("Failed to start bot:", error); // Handle error if the request fails
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="p-6 flex flex-col items-center h-screen w-screen">
      <WetPaintButton
        onClick={toggleModal}
        text="Create New Bot"
        className={"self-end"}
      />

      <CreateBotModal
        isOpen={isModalOpen}
        toggleModal={toggleModal}
        botName={botName}
        setBotName={setBotName}
        botPrompt={botPrompt}
        setBotPrompt={setBotPrompt}
        botToken={botToken}
        setBotToken={setBotToken}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        botLink={botLink}
        error={error}
      />

      {/* Displaying the user bots */}
      <div className="mt-8 w-full">
        <h2 className="text-2xl font-semibold mb-4">Your Discord Bots</h2>
        {bots.length === 0 ? (
          <p>You have no bots yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {bots.map((bot) => (
              <Card
                inviteLink={bot.invite_link}
                key={bot.id}
                title={bot.name}
                subtitle={bot.prompt}
                className="bg-blue-300"
                botToken={bot.discord_token}
                botId={bot.id}
                status={bot.status}
                handleStartBot={handleStartBot} // Pass handleStartBot to Card component
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
