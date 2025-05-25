import Foundation
import PushKit
import CallKit
import React

@objc(VoIPManager)
class VoIPManager: RCTEventEmitter, PKPushRegistryDelegate {

    private var pushRegistry: PKPushRegistry?
    private var hasListeners = false

    override init() {
        super.init()
        setupPushRegistry()
    }

    // MARK: - React Native Bridge Methods

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc
    override func supportedEvents() -> [String]! {
        return [
            "VoIPTokenReceived",
            "VoIPNotificationReceived",
            "VoIPCallEnded"
        ]
    }

    override func startObserving() {
        hasListeners = true
    }

    override func stopObserving() {
        hasListeners = false
    }

    // MARK: - Exposed Methods to React Native

    @objc
    func registerForVoIPPushes(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        DispatchQueue.main.async {
            self.pushRegistry?.desiredPushTypes = [.voIP]
            resolve("VoIP registration initiated")
        }
    }

    @objc
    func getVoIPToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let token = pushRegistry?.pushToken(for: .voIP) else {
            reject("NO_TOKEN", "VoIP token not available", nil)
            return
        }

        let tokenString = token.map { String(format: "%02x", $0) }.joined()
        resolve(tokenString)
    }

    // MARK: - Private Methods

    private func setupPushRegistry() {
        pushRegistry = PKPushRegistry(queue: DispatchQueue.main)
        pushRegistry?.delegate = self
        pushRegistry?.desiredPushTypes = [.voIP]
    }

    // MARK: - PKPushRegistryDelegate

    func pushRegistry(_ registry: PKPushRegistry, didUpdate pushCredentials: PKPushCredentials, for type: PKPushType) {
        if type == .voIP {
            let token = pushCredentials.token
            let tokenString = token.map { String(format: "%02x", $0) }.joined()

            print("VoIP Token: \(tokenString)")

            if hasListeners {
                sendEvent(withName: "VoIPTokenReceived", body: ["token": tokenString])
            }
        }
    }

    func pushRegistry(_ registry: PKPushRegistry, didInvalidatePushTokenFor type: PKPushType) {
        if type == .voIP {
            print("VoIP token invalidated")
        }
    }

    func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType, completion: @escaping () -> Void) {
        if type == .voIP {
            handleVoIPNotification(payload: payload, completion: completion)
        }
    }

    // iOS 11+ method
    func pushRegistry(_ registry: PKPushRegistry, didReceiveIncomingPushWith payload: PKPushPayload, for type: PKPushType) {
        if type == .voIP {
            handleVoIPNotification(payload: payload) { }
        }
    }

    // MARK: - VoIP Notification Handling

    private func handleVoIPNotification(payload: PKPushPayload, completion: @escaping () -> Void) {
        let payloadDict = payload.dictionaryPayload

        guard let offerValue = payloadDict["offer"] else {
            print("No 'offer' key found in payload")
            completion()
            return
        }

        var callerName = "Unknown"
        var callerAvatar = ""
        var callerId = ""
        var channelId = ""

        if let offerString = offerValue as? String,
           let offerData = offerString.data(using: .utf8),
           let offerDict = try? JSONSerialization.jsonObject(with: offerData) as? [String: Any] {
            callerName = offerDict["callerName"] as? String ?? "Unknown"
            callerAvatar = offerDict["callerAvatar"] as? String ?? ""
            callerId = offerDict["callerId"] as? String ?? ""
            channelId = offerDict["channelId"] as? String ?? ""
        } else if let offerDict = offerValue as? [String: Any] {
            callerName = offerDict["callerName"] as? String ?? "Unknown"
            callerAvatar = offerDict["callerAvatar"] as? String ?? ""
            callerId = offerDict["callerId"] as? String ?? ""
            channelId = offerDict["channelId"] as? String ?? ""
        } else {
            print("Unexpected format for 'offer': \(type(of: offerValue))")
            dump(offerValue)
            completion()
            return
        }
        print("Caller Name: \(callerName)")
        print("Caller Avatar: \(callerAvatar)")
        print("Caller ID: \(callerId)")
        print("Channel ID: \(channelId)")
        // Report the incoming call to CallKeep
        RNCallKeep.reportNewIncomingCall(
            "0731961b-415b-44f3-a960-dd94ef3372fc",
            handle: callerId,
            handleType: "generic",
            hasVideo: false,
            localizedCallerName: callerName,
            supportsHolding: true,
            supportsDTMF: true,
            supportsGrouping: false,
            supportsUngrouping: false,
            fromPushKit: true,
            payload: payloadDict,
            withCompletionHandler: {
                print("Incoming call reported successfully")
            }
        )

        completion()
    }
}
