"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"

interface AIProvider {
  id: string
  name: string
  enabled: boolean
  key: string
  url: string
  testStatus: "idle" | "loading" | "success" | "error"
}

interface AIProviderSettingsProps {
  expanded?: boolean
}

export default function AIProviderSettings({ expanded = false }: AIProviderSettingsProps) {
  const [providers, setProviders] = useState<AIProvider[]>([
    { id: "anthropic", name: "Anthropic", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "azure", name: "Azure", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "deepseek", name: "DeepSeek", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "gitkraken", name: "GitKraken AI", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "github-copilot", name: "GitHub Copilot", enabled: true, key: "", url: "", testStatus: "idle" },
    {
      id: "github-copilot-vscode",
      name: "GitHub Copilot (VS Code provided)",
      enabled: true,
      key: "",
      url: "",
      testStatus: "idle",
    },
    { id: "google", name: "Google", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "huggingface", name: "Hugging Face", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "ollama", name: "Ollama", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "openai", name: "OpenAI", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "openai-compatible", name: "OpenAI Compatible", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "openrouter", name: "OpenRouter", enabled: true, key: "", url: "", testStatus: "idle" },
    { id: "xai", name: "xAI", enabled: true, key: "", url: "", testStatus: "idle" },
  ])

  const [showAllProviders, setShowAllProviders] = useState(false)
  const [expandedProviders, setExpandedProviders] = useState<string[]>(
    expanded ? providers.filter((p) => p.enabled).map((p) => p.id) : [],
  )

  const updateProvider = (id: string, updates: Partial<AIProvider>) => {
    setProviders(providers.map((provider) => (provider.id === id ? { ...provider, ...updates } : provider)))

    // If disabling a provider, remove it from expanded list
    if (updates.enabled === false) {
      setExpandedProviders((prev) => prev.filter((expandedId) => expandedId !== id))
    }
  }

  const saveAndTest = (id: string) => {
    const provider = providers.find((p) => p.id === id)
    if (!provider) return

    // Validation: URL requires a key
    if (provider.url && !provider.key) {
      alert("A compatible API key is required when using a custom URL")
      return
    }

    updateProvider(id, { testStatus: "loading" })

    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3 // 70% chance of success for demo
      updateProvider(id, {
        testStatus: success ? "success" : "error",
      })

      // Reset status after 3 seconds
      setTimeout(() => {
        updateProvider(id, { testStatus: "idle" })
      }, 3000)
    }, 1500)
  }

  const visibleProviders = showAllProviders ? providers : providers.slice(0, 4)
  const hiddenProviders = showAllProviders ? [] : providers.slice(4)

  return (
    <div className="space-y-4">
      <Accordion type="multiple" value={expandedProviders} onValueChange={setExpandedProviders} className="space-y-4">
        {visibleProviders.map((provider, index) => (
          <AccordionItem
            key={provider.id}
            value={provider.id}
            className="border border-gray-700 rounded-md overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 bg-opacity-30">
              <div className="flex items-center">
                {provider.enabled ? (
                  <AccordionTrigger className="hover:no-underline py-0">
                    <span className="font-medium">{provider.name}</span>
                  </AccordionTrigger>
                ) : (
                  <div className="py-0">
                    <span className="font-medium text-gray-500">{provider.name}</span>
                  </div>
                )}
                <div className="flex items-center ml-2 space-x-1">
                  {provider.key && <span className="w-2 h-2 bg-green-500 rounded-full" title="API Key configured" />}
                  {provider.url && <span className="w-2 h-2 bg-blue-500 rounded-full" title="Custom URL configured" />}
                </div>
              </div>
              <div className="flex items-center">
                <Switch
                  checked={provider.enabled}
                  onCheckedChange={(checked) => updateProvider(provider.id, { enabled: checked })}
                  className="data-[state=checked]:bg-[#a881fc]"
                />
              </div>
            </div>

            <AccordionContent className="px-4 py-3">
              {provider.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">API Key</label>
                    <div className="flex">
                      <Input
                        type="password"
                        value={provider.key}
                        onChange={(e) => updateProvider(provider.id, { key: e.target.value })}
                        placeholder={`Enter ${provider.name} API key`}
                        className="bg-gray-800 border-gray-700 text-white flex-1"
                      />
                      {provider.key && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-gray-400 hover:text-white"
                          onClick={() => updateProvider(provider.id, { key: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Custom URL (optional)</label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={provider.url}
                        onChange={(e) => updateProvider(provider.id, { url: e.target.value })}
                        placeholder={`Enter custom URL for ${provider.name}`}
                        className="bg-gray-800 border-gray-700 text-white flex-1"
                      />
                      {provider.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2 text-gray-400 hover:text-white"
                          onClick={() => updateProvider(provider.id, { url: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {provider.url && !provider.key
                        ? "A compatible API key is required when using a custom URL"
                        : "Custom URL is optional when providing an API key"}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <Button
                      onClick={() => saveAndTest(provider.id)}
                      disabled={provider.testStatus === "loading" || (!provider.key && !provider.url)}
                      variant="outline"
                      className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
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
                        "Save and Test"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}

        {/* Animated additional providers */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showAllProviders ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4">
            {hiddenProviders.map((provider, index) => (
              <AccordionItem
                key={provider.id}
                value={provider.id}
                className={`border border-gray-700 rounded-md overflow-hidden transition-all duration-300 ease-out ${
                  showAllProviders ? "transform translate-y-0 opacity-100" : "transform translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: showAllProviders ? `${index * 50}ms` : "0ms",
                }}
              >
                <div className="flex items-center justify-between px-4 py-3 bg-gray-800 bg-opacity-30">
                  <div className="flex items-center">
                    {provider.enabled ? (
                      <AccordionTrigger className="hover:no-underline py-0">
                        <span className="font-medium">{provider.name}</span>
                      </AccordionTrigger>
                    ) : (
                      <div className="py-0">
                        <span className="font-medium text-gray-500">{provider.name}</span>
                      </div>
                    )}
                    <div className="flex items-center ml-2 space-x-1">
                      {provider.key && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" title="API Key configured" />
                      )}
                      {provider.url && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full" title="Custom URL configured" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={(checked) => updateProvider(provider.id, { enabled: checked })}
                      className="data-[state=checked]:bg-[#a881fc]"
                    />
                  </div>
                </div>

                <AccordionContent className="px-4 py-3">
                  {provider.enabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">API Key</label>
                        <div className="flex">
                          <Input
                            type="password"
                            value={provider.key}
                            onChange={(e) => updateProvider(provider.id, { key: e.target.value })}
                            placeholder={`Enter ${provider.name} API key`}
                            className="bg-gray-800 border-gray-700 text-white flex-1"
                          />
                          {provider.key && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 text-gray-400 hover:text-white"
                              onClick={() => updateProvider(provider.id, { key: "" })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Custom URL (optional)</label>
                        <div className="flex">
                          <Input
                            type="text"
                            value={provider.url}
                            onChange={(e) => updateProvider(provider.id, { url: e.target.value })}
                            placeholder={`Enter custom URL for ${provider.name}`}
                            className="bg-gray-800 border-gray-700 text-white flex-1"
                          />
                          {provider.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 text-gray-400 hover:text-white"
                              onClick={() => updateProvider(provider.id, { url: "" })}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {provider.url && !provider.key
                            ? "A compatible API key is required when using a custom URL"
                            : "Custom URL is optional when providing an API key"}
                        </p>
                      </div>

                      <div className="flex items-center">
                        <Button
                          onClick={() => saveAndTest(provider.id)}
                          disabled={provider.testStatus === "loading" || (!provider.key && !provider.url)}
                          variant="outline"
                          className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
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
                            "Save and Test"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </div>
        </div>
      </Accordion>

      {!showAllProviders && providers.length > 4 && (
        <div className="relative">
          <div
            className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, rgba(30, 30, 30, 0) 0%, rgba(30, 30, 30, 0.3) 40%, rgba(30, 30, 30, 0.8) 80%, rgba(30, 30, 30, 1) 100%)",
              marginBottom: "40px",
            }}
          />
          <div className="pt-4">
            <Button
              variant="ghost"
              className="w-full text-gray-300 hover:text-white transition-all duration-200 hover:bg-gray-700"
              onClick={() => setShowAllProviders(true)}
            >
              Show all providers
            </Button>
          </div>
        </div>
      )}

      {showAllProviders && (
        <Button
          variant="ghost"
          className="w-full text-gray-300 hover:text-white mt-4 transition-all duration-200 hover:bg-gray-700"
          onClick={() => setShowAllProviders(false)}
        >
          Show fewer providers
        </Button>
      )}
    </div>
  )
}
