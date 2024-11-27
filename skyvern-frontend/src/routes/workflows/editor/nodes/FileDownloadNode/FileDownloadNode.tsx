import { AutoResizingTextarea } from "@/components/AutoResizingTextarea/AutoResizingTextarea";
import { HelpTooltip } from "@/components/HelpTooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { CodeEditor } from "@/routes/workflows/components/CodeEditor";
import { useDeleteNodeCallback } from "@/routes/workflows/hooks/useDeleteNodeCallback";
import { useNodeLabelChangeHandler } from "@/routes/workflows/hooks/useLabelChangeHandler";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import {
  commonFieldPlaceholders,
  commonHelpTooltipContent,
} from "../../constants";
import { EditableNodeTitle } from "../components/EditableNodeTitle";
import { NodeActionMenu } from "../NodeActionMenu";
import { errorMappingExampleValue } from "../types";
import type { FileDownloadNode } from "./types";

const urlTooltip =
  "The URL Skyvern is navigating to. Leave this field blank to pick up from where the last block left off.";
const urlPlaceholder = "https://";
const navigationGoalTooltip =
  "Give Skyvern an objective that describes how to download the file.";
const navigationGoalPlaceholder = "Tell Skyvern which file to download.";

function FileDownloadNode({ id, data }: NodeProps<FileDownloadNode>) {
  const { updateNodeData } = useReactFlow();
  const { editable } = data;
  const [label, setLabel] = useNodeLabelChangeHandler({
    id,
    initialValue: data.label,
  });
  const [inputs, setInputs] = useState({
    url: data.url,
    navigationGoal: data.navigationGoal,
    errorCodeMapping: data.errorCodeMapping,
    maxRetries: data.maxRetries,
    maxStepsOverride: data.maxStepsOverride,
    continueOnFailure: data.continueOnFailure,
    cacheActions: data.cacheActions,
    downloadSuffix: data.downloadSuffix,
    totpVerificationUrl: data.totpVerificationUrl,
    totpIdentifier: data.totpIdentifier,
  });
  const deleteNodeCallback = useDeleteNodeCallback();

  function handleChange(key: string, value: unknown) {
    if (!editable) {
      return;
    }
    setInputs({ ...inputs, [key]: value });
    updateNodeData(id, { [key]: value });
  }

  return (
    <div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        className="opacity-0"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="b"
        className="opacity-0"
      />
      <div className="w-[30rem] space-y-4 rounded-lg bg-slate-elevation3 px-6 py-4">
        <header className="flex h-[2.75rem] justify-between">
          <div className="flex gap-2">
            <div className="flex h-[2.75rem] w-[2.75rem] items-center justify-center rounded border border-slate-600">
              <DownloadIcon className="size-6" />
            </div>
            <div className="flex flex-col gap-1">
              <EditableNodeTitle
                value={label}
                editable={editable}
                onChange={setLabel}
                titleClassName="text-base"
                inputClassName="text-base"
              />
              <span className="text-xs text-slate-400">
                File Download Block
              </span>
            </div>
          </div>
          <NodeActionMenu
            onDelete={() => {
              deleteNodeCallback(id);
            }}
          />
        </header>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">URL</Label>
              <HelpTooltip content={urlTooltip} />
            </div>
            <AutoResizingTextarea
              onChange={(event) => {
                if (!editable) {
                  return;
                }
                handleChange("url", event.target.value);
              }}
              value={inputs.url}
              placeholder={urlPlaceholder}
              className="nopan text-xs"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Label className="text-xs text-slate-300">Download Goal</Label>
              <HelpTooltip content={navigationGoalTooltip} />
            </div>
            <AutoResizingTextarea
              onChange={(event) => {
                if (!editable) {
                  return;
                }
                handleChange("navigationGoal", event.target.value);
              }}
              value={inputs.navigationGoal}
              placeholder={navigationGoalPlaceholder}
              className="nopan text-xs"
            />
          </div>
          <div className="rounded-md bg-slate-800 p-2 text-xs text-slate-400">
            Once the file is downloaded, this block will complete.
          </div>
        </div>
        <Separator />
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced" className="border-b-0">
            <AccordionTrigger className="py-0">
              Advanced Settings
            </AccordionTrigger>
            <AccordionContent className="pl-6 pr-1 pt-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Max Retries
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["maxRetries"]}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={commonFieldPlaceholders["maxRetries"]}
                    className="nopan w-52 text-xs"
                    min="0"
                    value={inputs.maxRetries ?? ""}
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      const value =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      handleChange("maxRetries", value);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Max Steps Override
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["maxStepsOverride"]}
                    />
                  </div>
                  <Input
                    type="number"
                    placeholder={commonFieldPlaceholders["maxStepsOverride"]}
                    className="nopan w-52 text-xs"
                    min="0"
                    value={inputs.maxStepsOverride ?? ""}
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      const value =
                        event.target.value === ""
                          ? null
                          : Number(event.target.value);
                      handleChange("maxStepsOverride", value);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-4">
                    <div className="flex gap-2">
                      <Label className="text-xs font-normal text-slate-300">
                        Error Messages
                      </Label>
                      <HelpTooltip
                        content={commonHelpTooltipContent["errorCodeMapping"]}
                      />
                    </div>
                    <Checkbox
                      checked={inputs.errorCodeMapping !== "null"}
                      disabled={!editable}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange(
                          "errorCodeMapping",
                          checked
                            ? JSON.stringify(errorMappingExampleValue, null, 2)
                            : "null",
                        );
                      }}
                    />
                  </div>
                  {inputs.errorCodeMapping !== "null" && (
                    <div>
                      <CodeEditor
                        language="json"
                        value={inputs.errorCodeMapping}
                        onChange={(value) => {
                          if (!editable) {
                            return;
                          }
                          handleChange("errorCodeMapping", value);
                        }}
                        className="nowheel nopan"
                        fontSize={8}
                      />
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Continue on Failure
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["continueOnFailure"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.continueOnFailure}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange("continueOnFailure", checked);
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      Cache Actions
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["cacheActions"]}
                    />
                  </div>
                  <div className="w-52">
                    <Switch
                      checked={inputs.cacheActions}
                      onCheckedChange={(checked) => {
                        if (!editable) {
                          return;
                        }
                        handleChange("cacheActions", checked);
                      }}
                    />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Label className="text-xs font-normal text-slate-300">
                      File Suffix
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["fileSuffix"]}
                    />
                  </div>
                  <Input
                    type="text"
                    placeholder={commonFieldPlaceholders["downloadSuffix"]}
                    className="nopan w-52 text-xs"
                    value={inputs.downloadSuffix ?? ""}
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      handleChange("downloadSuffix", event.target.value);
                    }}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-slate-300">
                      2FA Verification URL
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["totpVerificationUrl"]}
                    />
                  </div>
                  <AutoResizingTextarea
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      handleChange("totpVerificationUrl", event.target.value);
                    }}
                    value={inputs.totpVerificationUrl ?? ""}
                    placeholder={commonFieldPlaceholders["totpVerificationUrl"]}
                    className="nopan text-xs"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label className="text-xs text-slate-300">
                      2FA Identifier
                    </Label>
                    <HelpTooltip
                      content={commonHelpTooltipContent["totpIdentifier"]}
                    />
                  </div>
                  <AutoResizingTextarea
                    onChange={(event) => {
                      if (!editable) {
                        return;
                      }
                      handleChange("totpIdentifier", event.target.value);
                    }}
                    value={inputs.totpIdentifier ?? ""}
                    placeholder={commonFieldPlaceholders["totpIdentifier"]}
                    className="nopan text-xs"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export { FileDownloadNode };
