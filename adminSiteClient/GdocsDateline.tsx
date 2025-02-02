import { Col, Row } from "antd"
import { Dayjs } from "dayjs"
import {
    dayjs,
    OwidGdocInterface,
    OwidGdocErrorMessage,
} from "@ourworldindata/utils"
import React from "react"
import DatePicker from "./DatePicker.js"
import { GdocsSettingsContentField } from "./GdocsSettingsContentField.js"
import { getPropertyMostCriticalError } from "./gdocsValidation.js"
import { GdocsErrorHelp } from "./GdocsErrorHelp.js"

export const GdocsDateline = ({
    gdoc,
    setCurrentGdoc,
    errors,
}: {
    gdoc: OwidGdocInterface
    setCurrentGdoc: (gdoc: OwidGdocInterface) => void
    errors?: OwidGdocErrorMessage[]
}) => {
    const { publishedAt } = gdoc

    const onChangePublishedAt = (publishedAt: Dayjs | null) => {
        setCurrentGdoc({
            ...gdoc,
            publishedAt: publishedAt?.toDate() || null,
        })
    }

    const publishedAtError = getPropertyMostCriticalError("publishedAt", errors)

    return (
        <>
            <Row gutter={24}>
                <Col span={16}>
                    <GdocsSettingsContentField
                        property="dateline"
                        gdoc={gdoc}
                        errors={errors}
                    />
                </Col>
                <Col span={8}>
                    <label htmlFor="publishedAt">Publication date</label>
                    <DatePicker
                        onChange={onChangePublishedAt}
                        value={publishedAt ? dayjs(publishedAt) : undefined}
                        format="ddd, MMM D, YYYY"
                        id="publishedAt"
                        status={publishedAtError?.type}
                        // The "Today" button has been disabled because it sets
                        // the time to the current time. This time change makes
                        // it all the way to the atom feed, which is then
                        // interpreted by MailChimp's RSS-to-Email as a new
                        // article.
                        showToday={false}
                    />
                    <GdocsErrorHelp
                        error={publishedAtError}
                        help={
                            "Used in default dateline. Visible in the citation block. Also used to sort articles in lists."
                        }
                    />
                </Col>
            </Row>
        </>
    )
}
