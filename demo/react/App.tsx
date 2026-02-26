import AGORA_RTM from "agora-rtm";
import {RTMProvider_2_2} from "@netless/forge-rtm";

import {useEffect} from "react";
import {Room} from "@netless/forge-room";
import {WhiteboardApplication} from "@netless/forge-whiteboard";
import "@netless/forge-web-ui";
import {config} from "../config.local.ts";
import {Toolbar} from "@netless/forge-web-ui";
import {ToolbarView} from "./ToolbarView.tsx";

function App() {
    // 初始化房间和白板
    useEffect(() => {
        const init = async () => {
            const rtmClient = new AGORA_RTM.RTM(config.rtmAppId, config.whiteboardUserId, {
                token: decodeURIComponent(config.rtmToken),
                presenceTimeout: 4,
                // logLevel: 'debug',
            } as any);
            await rtmClient.login();
            const rtmProvider = new RTMProvider_2_2(rtmClient);
            const room = new Room(config.whiteboardRoomId, rtmProvider);
            room.applicationManager.registerApplication(WhiteboardApplication);

            await room.joinRoom({
                userId: config.whiteboardUserId,
                nickName: config.whiteboardUserNickName,
                roomToken: config.whiteboardRoomToken,
                sdkConfig: {
                    region: config.whiteboardRegion as any,
                    appIdentifier: config.whiteboardAppId,
                },
                verboseLog: true,
                writable: true,
            });

            const whiteboard = await room.applicationManager.launchApplication(WhiteboardApplication, {
                width: 1920,
                height: 1080,
                defaultToolbarStyle: {
                    tool: "curve",
                    strokeColor: "#A1C473",
                },
            }, "MainWhiteboard");
            whiteboard.strokeColor = "#A1C473";
            whiteboard.view.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
        `;

            document.body.appendChild(whiteboard.view);

            const toolbar = document.getElementById("forge-toolbar") as Toolbar;
            toolbar.connectWhiteboard(whiteboard);
        };

        init();
    }, []);

    return (
        <div style={{width: "100vw", height: "100vh", display: "flex", flexDirection: "column"}}>
            <ToolbarView />
        </div>
    )
}

export default App
