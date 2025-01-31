"use client";

import { Button } from "@/components/ui/button";
import {
  DiscordIcon,
  SlackIcon,
  WebWidgetIcon,
  ConnectedIntegrationIcon
} from "@/components/Icons";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { getIntegrationsList } from "@/app/actions";

const IntegrationTypesList = ({ customGuru }) => {
  const [connectedIntegrations, setConnectedIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIntegration, setHoveredIntegration] = useState(null);

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        const response = await getIntegrationsList(customGuru);
        if (!response?.error) {
          setConnectedIntegrations(response || []);
        }
      } catch (error) {
        console.error("Failed to fetch integrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrations();
  }, [customGuru]);

  const isSelfHosted = process.env.NEXT_PUBLIC_NODE_ENV === "selfhosted";

  const integrationTypes = [
    ...(isSelfHosted
      ? []
      : [
          {
            id: "slack",
            name: "Slack Bot",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: SlackIcon,
            type: "SLACK"
          },
          {
            id: "discord",
            name: "Discord Bot",
            description:
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
            icon: DiscordIcon,
            type: "DISCORD"
          }
        ]),
    {
      id: "web_widget",
      name: "Web Widget",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      icon: WebWidgetIcon,
      type: "WEB_WIDGET"
    }
  ];

  const isIntegrationConnected = (type) => {
    return connectedIntegrations.some(
      (integration) => integration.type === type
    );
  };

  return (
    <main className="flex justify-center items-center w-full flex-grow">
      <section className="container mx-auto guru-lg:max-w-[1180px] bg-white h-full">
        <section className="flex flex-col flex-grow w-full p-6 border-b border-[#E5E7EB]">
          <h1 className="font-inter text-[20px] font-medium text-[#191919]">
            Integrations
          </h1>
        </section>
        <section className="flex flex-col flex-grow w-full guru-sm:px-4 px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {integrationTypes.map((integration) => {
              const Icon = integration.icon;
              const isConnected = isIntegrationConnected(integration.type);
              const workspaceName = connectedIntegrations.find(
                (connectedIntegration) =>
                  connectedIntegration.type === integration.type
              )?.workspace_name;

              return (
                <Link
                  key={integration.id}
                  href={`/guru/${customGuru}/integrations/${integration.id}`}
                  className={clsx(
                    "flex flex-col items-start relative",
                    "p-6",
                    "gap-4",
                    "flex-1",
                    "rounded-xl border-[0.5px] border-[#E2E2E2]",
                    "bg-[#FDFDFD] hover:bg-gray-50 transition-colors"
                  )}>
                  {isConnected && (
                    <div
                      className="absolute top-4 right-4"
                      onMouseEnter={() =>
                        setHoveredIntegration(integration.name)
                      }
                      onMouseLeave={() => setHoveredIntegration(null)}>
                      <ConnectedIntegrationIcon width={20} height={20} />
                      {hoveredIntegration === integration.name && (
                        <div
                          className="absolute rounded-lg shadow-lg p-3 border bg-[#1B242D] text-white"
                          style={{
                            bottom: "100%",
                            left: "50%",
                            transform: "translateX(-50%)",
                            marginBottom: "8px",
                            whiteSpace: "nowrap",
                            zIndex: 50
                          }}>
                          <div
                            className="absolute w-2 h-2 border-b border-r bg-[#1B242D]"
                            style={{
                              bottom: "-4px",
                              left: "50%",
                              transform: "translateX(-50%) rotate(45deg)",
                              borderColor: "inherit"
                            }}
                          />
                          <p
                            className="text-center font-inter px-2"
                            style={{ fontSize: "12px", fontWeight: 500 }}>
                            Connected to {workspaceName}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="w-8 h-8">
                    <Icon className="w-full h-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="font-inter text-sm font-medium text-[#191919]">
                      {integration.name}
                    </h3>
                    <p className="font-inter text-xs font-normal text-[#6D6D6D]">
                      {integration.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default IntegrationTypesList;
