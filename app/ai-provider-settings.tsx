"use client"

import type React from "react"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, AlertCircle, Check, X, Loader2, XCircle } from "lucide-react"

interface AIProvider {
  id: string
  name: string
  icon: string
  enabled: boolean
  key: string
  url: string
  expanded: boolean
  error?: string
  testStatus?: "idle" | "loading" | "success" | "error"
}

export default function AIProviderSettings() {
  const [leftColumnProviders, setLeftColumnProviders] = useState<AIProvider[]>([
    {
      id: "anthropic",
      name: "Anthropic",
      icon: "🤖",
      enabled: true,
      key: "sk_ant_123456789",
      url: "https://api.anthropic.com",
      expanded: true,
      testStatus: "idle",
    },
    {
      id: "azure",
      name: "Azure",
      icon: "☁️",
      enabled: true,
      key: "azure_key_123456",
      url: "",
      expanded: false,
      testStatus: "idle",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      icon: "🔍",
      enabled: true,
      key: "",
      url: "",
      expanded: false,
      testStatus: "idle",
    },
    {
      id: "gitkraken",
      name: "GitKraken AI",
      icon: "🐙",
      enabled: false,
      key: "gk_123456",
      url: "https://ai.gitkraken.com",
      expanded: false,
      testStatus: "idle",
    },
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      icon: "🐱",
      enabled: true,
      key: "github_123456",
      url: "",
      expanded: false,
      testStatus: "idle",
    },
    { id: "google", name: "Google", icon: "🔍", enabled: false, key: "", url: "", expanded: false, testStatus: "idle" },
  ])

  const [rightColumnProviders, setRightColumnProviders] = useState<AIProvider[]>([
    {
      id: "huggingface",
      name: "Hugging Face",
      icon: "🤗",
      enabled: true,
      key: "",
      url: "",
      expanded: false,
      testStatus: "idle",
    },
    { id: "ollama", name: "Ollama", icon: "🦙", enabled: false, key: "", url: "", expanded: false, testStatus: "idle" },
    { id: "openai", name: "OpenAI", icon: "🧠", enabled: false, key: "", url: "", expanded: false, testStatus: "idle" },
    {
      id: "openai-compatible",
      name: "OpenAI compatible",
      icon: "🔗",
      enabled: false,
      key: "",
      url: "",
      expanded: false,
      testStatus: "idle",
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      icon: "🛣️",
      enabled: false,
      key: "",
      url: "",
      expanded: false,
      testStatus: "idle",
    },
    { id: "xai", name: "xAI", icon: "❌", enabled: false, key: "", url: "", expanded: false, testStatus: "idle" },
  ])

  const updateLeftProvider = (id: string, updates: Partial<AIProvider>) => {
    setLeftColumnProviders((providers) =>
      providers.map((provider) =>
        provider.id === id
          ? {
              ...provider,
              ...updates,
              // If disabling, also collapse and clear errors
              ...(updates.enabled === false ? { expanded: false, error: undefined, testStatus: "idle" } : {}),
              // Clear error when updating fields
              ...(updates.key !== undefined || updates.url !== undefined ? { error: undefined } : {}),
            }
          : provider,
      ),
    )
  }

  const updateRightProvider = (id: string, updates: Partial<AIProvider>) => {
    setRightColumnProviders((providers) =>
      providers.map((provider) =>
        provider.id === id
          ? {
              ...provider,
              ...updates,
              // If disabling, also collapse and clear errors
              ...(updates.enabled === false ? { expanded: false, error: undefined, testStatus: "idle" } : {}),
              // Clear error when updating fields
              ...(updates.key !== undefined || updates.url !== undefined ? { error: undefined } : {}),
            }
          : provider,
      ),
    )
  }

  const saveAndTest = (provider: AIProvider, updateFn: (id: string, updates: Partial<AIProvider>) => void) => {
    // Validate: URL requires a key
    if (provider.url && !provider.key) {
      updateFn(provider.id, { error: "A compatible API key is required when using a custom URL", testStatus: "error" })
      return
    }

    // Clear any previous errors
    updateFn(provider.id, { error: undefined, testStatus: "loading" })

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% chance of success for demo
      updateFn(provider.id, {
        testStatus: success ? "success" : "error",
        error: success ? undefined : "Connection failed. Please check your credentials.",
      })

      // Reset success status after 3 seconds
      if (success) {
        setTimeout(() => {
          updateFn(provider.id, { testStatus: "idle" })
        }, 3000)
      }
    }, 1500)
  }

  const getProviderStatus = (provider: AIProvider) => {
    // Don't show any status indicators for disabled providers
    if (!provider.enabled) {
      return null
    }

    // Only show indicators for enabled providers
    if (provider.error) {
      return {
        label: "Error",
        className: "bg-red-500 bg-opacity-30 text-red-400",
        disabledClassName: "bg-gray-600 bg-opacity-50 text-gray-500",
      }
    } else if (provider.url && provider.key) {
      return {
        label: "URL",
        className: "bg-green-500 bg-opacity-30 text-green-400",
        disabledClassName: "bg-gray-600 bg-opacity-50 text-gray-500",
      }
    } else if (provider.key) {
      return {
        label: "Key",
        className: "bg-blue-500 bg-opacity-30 text-blue-400",
        disabledClassName: "bg-gray-600 bg-opacity-50 text-gray-500",
      }
    }
    return null
  }

  const ProviderCard = ({
    provider,
    onUpdate,
  }: {
    provider: AIProvider
    onUpdate: (id: string, updates: Partial<AIProvider>) => void
  }) => {
    const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(provider.id, { key: e.target.value })
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate(provider.id, { url: e.target.value })
    }

    const status = getProviderStatus(provider)

    return (
      <div className="border border-gray-700 rounded-md overflow-hidden mb-3">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 bg-opacity-30">
          <div className="flex items-center flex-1">
            {provider.enabled ? (
              <button
                onClick={() => onUpdate(provider.id, { expanded: !provider.expanded })}
                className="flex items-center gap-2 text-left hover:text-gray-300 transition-colors"
              >
                <span className="text-lg">{provider.icon}</span>
                <span className="font-medium">{provider.name}</span>
                {provider.expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg opacity-50">{provider.icon}</span>
                <span className="font-medium text-gray-500">{provider.name}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            )}

            {/* Single status indicator */}
            {status && (
              <div className="flex items-center ml-2">
                <span
                  className={`px-1.5 py-0.5 text-xs rounded ${
                    provider.enabled ? status.className : status.disabledClassName
                  }`}
                >
                  {status.label}
                </span>
              </div>
            )}
          </div>
          <Switch
            checked={provider.enabled}
            onCheckedChange={(checked) => onUpdate(provider.id, { enabled: checked })}
            className="data-[state=checked]:bg-[#a881fc]"
          />
        </div>

        {provider.enabled && provider.expanded && (
          <div className="px-4 py-4 space-y-4">
            <div className="relative">
              <input
                type="password"
                value={provider.key}
                onChange={handleKeyChange}
                placeholder="Enter API key"
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a881fc] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
              />
              {provider.key && (
                <button
                  onClick={() => onUpdate(provider.id, { key: "" })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                value={provider.url}
                onChange={handleUrlChange}
                placeholder="Enter Custom URL"
                className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a881fc] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 pr-10"
              />
              {provider.url && (
                <button
                  onClick={() => onUpdate(provider.id, { url: "" })}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>

            {provider.error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{provider.error}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              disabled={!provider.key && !provider.url}
              onClick={() => saveAndTest(provider, onUpdate)}
              className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {provider.testStatus === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : provider.testStatus === "success" ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Connection successful
                </>
              ) : provider.testStatus === "error" ? (
                <>
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  Connection failed
                </>
              ) : (
                "Save and test"
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Column */}
      <div>
        {leftColumnProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} onUpdate={updateLeftProvider} />
        ))}
      </div>

      {/* Right Column */}
      <div>
        {rightColumnProviders.map((provider) => (
          <ProviderCard key={provider.id} provider={provider} onUpdate={updateRightProvider} />
        ))}
      </div>
    </div>
  )
}
