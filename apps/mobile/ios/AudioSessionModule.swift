import Foundation
import AVFoundation
import React

@objc(AudioSessionModule)
class AudioSessionModule: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func setSpeaker(_ isSpeaker: Bool, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let audioSession = AVAudioSession.sharedInstance()
      
      // Configure audio session for voice chat
      try audioSession.setCategory(.playAndRecord,
                                   options: [.allowBluetooth, .allowBluetoothA2DP, .allowAirPlay, .mixWithOthers])
      
      // Set the preferred output
      if isSpeaker {
        try audioSession.overrideOutputAudioPort(.speaker)
      } else {
        try audioSession.overrideOutputAudioPort(.none)
      }
      
      // Activate the audio session
      try audioSession.setActive(true)
      
      resolver(true)
    } catch {
      rejecter("AUDIO_ERROR", "Failed to set speaker: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func getCurrentAudioOutput(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let audioSession = AVAudioSession.sharedInstance()
    let currentRoute = audioSession.currentRoute
    
    // Check if speaker is active
    let isSpeaker = currentRoute.outputs.contains { output in
      output.portType == .builtInSpeaker
    }
    
    resolver(isSpeaker ? "speaker" : "earpiece")
  }
  
  @objc
  func isBluetoothConnected(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    let audioSession = AVAudioSession.sharedInstance()
    let currentRoute = audioSession.currentRoute
    
    let isBluetooth = currentRoute.outputs.contains { output in
      output.portType == .bluetoothA2DP || output.portType == .bluetoothLE || output.portType == .bluetoothHFP
    }
    
    resolver(isBluetooth)
  }
  
  @objc
  func setAudioDevice(_ deviceType: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    switch deviceType {
    case "speaker":
      setSpeaker(true, resolver: resolver, rejecter: rejecter)
    case "earpiece":
      setSpeaker(false, resolver: resolver, rejecter: rejecter)
    case "bluetooth":
      setBluetooth(resolver, rejecter: rejecter)
    default:
      rejecter("INVALID_DEVICE", "Invalid device type: \(deviceType)", nil)
    }
  }
  
  private func setBluetooth(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let audioSession = AVAudioSession.sharedInstance()
      
      // Configure audio session for bluetooth
      try audioSession.setCategory(.playAndRecord,
                                   options: [.allowBluetooth, .allowBluetoothA2DP, .allowAirPlay, .mixWithOthers])
      
      // Remove any output override to allow bluetooth
      try audioSession.overrideOutputAudioPort(.none)
      
      // Activate the audio session
      try audioSession.setActive(true)
      
      resolver(true)
    } catch {
      rejecter("AUDIO_ERROR", "Failed to set bluetooth: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func startAudioSession(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let audioSession = AVAudioSession.sharedInstance()
      
      // Configure audio session for voice chat with mixing
      try audioSession.setCategory(.ambient,
                                   options: [.allowBluetooth, .allowBluetoothA2DP, .allowAirPlay, .mixWithOthers])
      
      // Activate the audio session
      try audioSession.setActive(true)
      
      resolver(true)
    } catch {
      rejecter("AUDIO_ERROR", "Failed to start audio session: \(error.localizedDescription)", error)
    }
  }
  
  @objc
  func stopAudioSession(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    do {
      let audioSession = AVAudioSession.sharedInstance()
      try audioSession.setActive(false)
      resolver(true)
    } catch {
      rejecter("AUDIO_ERROR", "Failed to stop audio session: \(error.localizedDescription)", error)
    }
  }
}
