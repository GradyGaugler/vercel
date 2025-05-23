"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import AIProviderSettings from "./ai-provider-settings"

export default function SecurityControlsPage() {
  const [aiFeatures, setAiFeatures] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)
  const [cloudPatches, setCloudPatches] = useState(true)
  const [selfHosted, setSelfHosted] = useState(false)

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      <h1 className="text-2xl font-medium mb-10">Settings</h1>

      <div className="max-w-4xl">
        <h2 className="text-xl font-medium mb-6">Administration & Security Controls</h2>

        {/* Require approval for organization invites */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Require approval for organization invites</h3>
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-4">
              <p className="text-gray-300 text-sm">
                Anyone in your organization can invite other users to it. If you turn this on, the invites will require
                an admin, billing contact, or owner to approve the invite before joining your organization.
              </p>
            </div>
            <Switch
              checked={requireApproval}
              onCheckedChange={setRequireApproval}
              className="data-[state=checked]:bg-[#a881fc]"
            />
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">AI features</h3>
            <span className="px-2 py-0.5 text-xs bg-[#a881fc] bg-opacity-30 text-[#a881fc] rounded">Experimental</span>
          </div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1 mr-4">
              <p className="text-gray-300 text-sm">
                Allows developers in your organization to generate commit messages from staged changes. Only Azure and
                OpenAI are supported including OpenAI and Anthropic models.{" "}
                <a href="#" className="text-[#12d9c1] hover:underline">
                  Learn more
                </a>
              </p>
            </div>
            <Switch
              checked={aiFeatures}
              onCheckedChange={setAiFeatures}
              className="data-[state=checked]:bg-[#a881fc]"
            />
          </div>

          {aiFeatures && (
            <div>
              <h4 className="text-md font-medium mb-4">AI provider settings:</h4>
              <AIProviderSettings />
            </div>
          )}
        </div>

        {/* Cloud Patches */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Cloud Patches</h3>
            <span className="px-2 py-0.5 text-xs bg-[#a881fc] bg-opacity-30 text-[#a881fc] rounded">Preview</span>
          </div>

          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 mr-4">
              <p className="text-gray-300 text-sm">
                Allow developers in your organization to create Cloud Patches that can be shared with others. A Cloud
                Patch is a Git patch that is stored securely by GitKraken.{" "}
                <a href="#" className="text-[#12d9c1] hover:underline">
                  Learn more
                </a>
              </p>
            </div>
            <Switch
              checked={cloudPatches}
              onCheckedChange={setCloudPatches}
              className="data-[state=checked]:bg-[#a881fc]"
            />
          </div>

          <div className="flex items-center mb-6">
            <Checkbox
              id="self-hosted"
              checked={selfHosted}
              onCheckedChange={(checked) => setSelfHosted(checked === true)}
              className="border-gray-500 data-[state=checked]:bg-[#a881fc] data-[state=checked]:border-[#a881fc]"
            />
            <label htmlFor="self-hosted" className="ml-2 text-white text-sm">
              Enable Self-hosted
            </label>
            <span className="ml-2 text-gray-400 text-sm">
              Can host your organization's Cloud Patches on your own AWS S3 bucket.
            </span>
          </div>

          <Button className="bg-[#a881fc] hover:bg-[#9b60e6] text-white">Save & Test Configuration</Button>
        </div>
      </div>
    </div>
  )
}
