"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import AIProviderSettings from "./ai-provider-settings"

export default function SecurityControlsPage() {
  const [aiFeatures, setAiFeatures] = useState(true)
  const [requireApproval, setRequireApproval] = useState(true)
  const [conflictPrevention, setConflictPrevention] = useState(true)
  const [cloudPatches, setCloudPatches] = useState(true)
  const [selfHosted, setSelfHosted] = useState(false)

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-white p-6">
      <h1 className="text-2xl font-medium mb-10">Settings</h1>

      <div className="border-b border-gray-700 pb-8 mb-8">
        <h2 className="text-xl font-medium mb-8">Administration & Security Controls for GitKraken</h2>

        {/* AI Features */}
        <div className="mb-10">
          <h3 className="text-lg font-medium mb-4">AI Features</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-300 mb-1">
                Allows developers in your organization to use GitKraken AI features. Disable to prevent usage of
                GitKraken AI features.
                <a href="#" className="text-[#a881fc] ml-1">
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
            <div className="mt-6">
              <h4 className="text-md font-medium mb-4">AI Provider Settings</h4>

              <p className="text-gray-300 mb-4">
                Configure which AI providers your organization members can use and set custom API keys or endpoints.
              </p>

              <AIProviderSettings expanded={false} />
            </div>
          )}
        </div>

        {/* Require approval for organization invites */}
        <div className="mb-10">
          <h3 className="text-lg font-medium mb-4">Require approval for organization invites</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-300 mb-1">
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
      </div>

      {/* Conflict Prevention */}
      <div className="border-b border-gray-700 pb-8 mb-8">
        <h3 className="text-lg font-medium mb-4">Conflict Prevention</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-300 mb-1">
              Allows GitKraken to notify teammates about potential conflicts based on a summary of their changes. Your
              actual code is never shared - only metadata about file changes on org members' working branches to detect
              overlapping edits.
              <a href="#" className="text-[#a881fc] ml-1">
                Learn More
              </a>
            </p>
          </div>
          <Switch
            checked={conflictPrevention}
            onCheckedChange={setConflictPrevention}
            className="data-[state=checked]:bg-[#a881fc]"
          />
        </div>
      </div>

      {/* Cloud Patches */}
      <div>
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium">Cloud Patches</h3>
          <span className="ml-2 px-2 py-0.5 text-xs bg-[#a881fc] bg-opacity-30 text-[#a881fc] rounded">Preview</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-300 mb-1">
              Allows developers in your organization to create Cloud Patches that can be shared with others. A Cloud
              Patch is a Git patch that is stored securely by GitKraken.
              <a href="#" className="text-[#a881fc] ml-1">
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

        <p className="text-gray-300 mb-4">
          If you have questions or concerns with the Cloud Patches feature please reach out to
          <a href="#" className="text-[#a881fc] ml-1">
            Customer Success
          </a>
          .
        </p>

        <div className="flex items-center mb-2">
          <Checkbox
            id="self-hosted"
            checked={selfHosted}
            onCheckedChange={(checked) => setSelfHosted(checked === true)}
            className="border-gray-500 data-[state=checked]:bg-[#a881fc] data-[state=checked]:border-[#a881fc]"
          />
          <label htmlFor="self-hosted" className="ml-2 text-white">
            Enable Self-hosted
          </label>
        </div>

        <p className="text-gray-300">You can host your organization's Cloud Patches on your own AWS S3 bucket.</p>
      </div>
    </div>
  )
}
