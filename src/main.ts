import { Room } from "@netless/forge-room";
import { RTMProvider_2_2 } from "@netless/forge-rtm";
import { WhiteboardApplication } from "@netless/forge-whiteboard";

import AGORA_RTM from "agora-rtm";

import { config } from "./config.local.ts";

import "./Toolbar.ts";
import "./ToolbarAsset.ts";
import "./ToolbarIcon.ts";
import "./ToolbarMenu.ts";
import "./DragHandle.ts";
import {Toolbar} from "./Toolbar.ts";


(async function main() {
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

    console.log(whiteboard);
})();
// const icon = document.createElement("forge-toolbar-icon");
// icon.setAttribute("icon", "/assets/selector.svg");
// icon.setAttribute("action", "tool.pen");

// document.getElementById("toolbar")!.appendChild(icon);