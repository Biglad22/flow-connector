
export const postMessageToUI = <T extends Record<string, any>>(
    message : {type : string} & T
) => figma.ui.postMessage(message);