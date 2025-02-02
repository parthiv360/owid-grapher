#! /usr/bin/env jest

import React from "react"
import { ExplorerControlType } from "./ExplorerConstants.js"
import { ExplorerControlPanel } from "./ExplorerControls.js"

import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
Enzyme.configure({ adapter: new Adapter() })

describe(ExplorerControlPanel, () => {
    const options = [
        {
            label: "Paper",
            available: true,
            value: "paper",
        },
        {
            label: "Plastic",
            available: true,
            value: "plastic",
        },
    ]

    const element = Enzyme.mount(
        <ExplorerControlPanel
            choice={{
                title: "Some decision",
                value: "",
                options,
                type: ExplorerControlType.Radio,
            }}
            explorerSlug="explorer_slug"
            isMobile={false}
        />
    )

    it("renders options", () => {
        expect(element.find(`.AvailableOption`).length).toEqual(2)
    })
})
