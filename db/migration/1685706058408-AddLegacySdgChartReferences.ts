import { MigrationInterface, QueryRunner } from "typeorm"

export class AddLegacySdgChartReferences1685706058408
    implements MigrationInterface
{
    private async insertSlug(
        queryRunner: QueryRunner,
        slug: string
    ): Promise<void> {
        const rows = await queryRunner.query(
            `-- sql
                select id from charts where slug = ? and publishedAt is not null
                union all
                select chart_id as id
                from chart_slug_redirects
                join charts on charts.id = chart_slug_redirects.chart_id
                where chart_slug_redirects.slug = ? and publishedAt is not null
            `,
            [slug, slug]
        )
        if (rows.length === 0) {
            console.error(`No chart found for ${slug}`)
            return
        }
        if (rows.length > 1) {
            // This can happen if a chart exists with a given url and there is a chart redirect of this url to another chart. In
            // these cases the chart with the slug wins, not the redirect.
            console.error(
                `Multiple charts found for ${slug} - ${rows
                    .map((r: any) => r.id)
                    .join(", ")}} - using the first image`
            )
        }
        const chartId = rows[0].id
        await queryRunner.query(
            `-- sql
            INSERT INTO legacy_sdg_chart_references (slug, chartId) VALUES (?, ?)
        `,
            [slug, chartId]
        )
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`-- sql
        CREATE TABLE IF NOT EXISTS legacy_sdg_chart_references (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255),
                chartId int references charts(id) on delete restrict on update restrict,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `)

        // this is inefficient but it's a one-time migration so it's fine
        for (const slug of linkedSdgChartsAsOf2023_04_10) {
            await this.insertSlug(queryRunner, slug)
        }
        for (const slug of embeddedSdgChartsAsOf2023_04_10) {
            await this.insertSlug(queryRunner, slug)
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`-- sql
            DROP TABLE IF EXISTS legacy_sdg_chart_references;
        `)
    }
}

// This and the one below are taken from
// https://docs.google.com/spreadsheets/d/1RFKqagbs8eSdfUOAZTKSOXO7RdopOelxiGGkSA6KPLc/edit#gid=580759582
const linkedSdgChartsAsOf2023_04_10 = [
    "forest-area-km",
    "natural-disaster-deaths-ihme",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "direct-disaster-economic-loss",
    "weather-losses-share-gdp",
    "absolute-number-of-deaths-from-outdoor-air-pollution",
    "death-rate-by-source-from-air-pollution",
    "natural-disaster-deaths-ihme",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "natural-disaster-deaths-ihme",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "natural-disaster-deaths-ihme",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "natural-disaster-deaths-ihme",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "natural-disaster-deaths-ihme",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "annual-co2-emissions-per-country",
    "co-emissions-per-capita",
    "co2-intensity",
    "gdp-per-capita-worldbank",
    "gdp-per-capita-worldbank",
    "average-working-hours-of-children",
    "international-tourist-arrivals",
    "active-mobile-money-accounts",
    "share-of-rural-population-with-electricity-access-vs-share-of-total-population-with-electricity-access",
    "number-of-people-with-and-without-electricity-access",
    "power-outages-in-firms-per-month",
    "share-of-rural-population-with-electricity-access-vs-share-of-total-population-with-electricity-access",
    "number-of-people-with-and-without-electricity-access",
    "power-outages-in-firms-per-month",
    "electricity-prod-source-stacked",
    "energy-intensity-by-sector",
    "law-mandate-equal-pay",
    "does-legislation-explicitly-criminalize-marital-rape",
    "gender-rights-to-property",
    "women-required-to-obey-husband",
    "does-law-mandate-paid-or-unpaid-maternity-leave",
    "testimony-weight-gender",
    "does-law-prohibit-or-invalidate-child-or-early-marriage",
    "share-of-women-using-modern-contraceptive-methods",
    "contraceptive-prevalence-any-methods-of-women-ages-15-49",
    "unmet-need-for-contraception-share-of-married-women-of-reproductive-age",
    "share-of-women-using-modern-contraceptive-methods",
    "contraceptive-prevalence-any-methods-of-women-ages-15-49",
    "unmet-need-for-contraception-share-of-married-women-of-reproductive-age",
    "net-oda-from-oecd-dac-countries",
    "net-oda-to-ldcs-from-oecd-countries",
    "number-of-internet-users",
    "broadband-penetration-by-country",
    "number-of-maternal-deaths-by-region",
    "number-of-maternal-deaths",
    "child-deaths-igme-data",
    "number-of-under-five-deaths-by-region",
    "child-mortality-rate-by-gender",
    "number-of-neonatal-deaths-ihme",
    "number-of-neonatal-deaths-by-region",
    "share-of-the-population-infected-with-hiv",
    "hiv-death-rates",
    "deaths-from-hiv-by-age",
    "tuberculosis-death-rates",
    "tuberculosis-deaths-by-age",
    "malaria-death-rates",
    "malaria-deaths-by-age",
    "hepatitis-death-rate",
    "cancer-death-rates",
    "cardiovascular-disease-death-rates",
    "stroke-death-rates",
    "suicide-deaths-by-age",
    "share-with-depression",
    "share-with-alcohol-use-disorders",
    "share-with-drug-use-disorders",
    "alcohol-or-drug-use-disorders-male-vs-female",
    "road-deaths-by-type",
    "unmet-need-for-contraception-share-of-married-women-of-reproductive-age",
    "contraceptive-prevalence-any-methods-of-women-ages-15-49",
    "share-of-out-of-pocket-expenditure-on-healthcare",
    "share-of-the-population-at-risk-of-catastrophic-expenditure-when-surgical-care-is-required",
    "risk-of-impoverishing-expenditure-for-surgical-care",
    "death-rates-from-ambient-particulate-air-pollution",
    "absolute-number-of-deaths-from-outdoor-air-pollution",
    "death-rate-by-source-from-indoor-air-pollution",
    "absolute-number-of-deaths-from-household-air-pollution",
    "death-rates-unsafe-water",
    "death-rate-from-unsafe-sanitation",
    "prevalence-of-daily-smoking-sdgs",
    "share-of-men-who-are-smoking",
    "share-of-women-who-are-smoking",
    "death-rate-smoking",
    "smoking-and-secondhand-deaths",
    "nurses-and-midwives-per-1000-people",
    "surgeons-per-100000",
    "dentistry-personnel-per-1000",
    "pharmaceutical-personnel-per-1000",
    "income-shares-by-quintile-pip",
    "income-share-of-the-top-10-pip",
    "inequality-before-and-after-taxes-and-transfers-Thewissen-et-al-data",
    "mobile-cellular-subscriptions-by-country",
    "number-of-internet-users",
    "world-population-in-extreme-poverty-absolute",
    "total-population-living-in-extreme-poverty-by-world-region",
    "share-multi-poverty",
    "urban-poverty-at-national-poverty-lines",
    "rural-population-poverty-at-national-poverty-lines",
    "adequacy-of-social-insurance-programs",
    "adequacy-of-unemployment-benefits",
    "adequacy-of-social-safety-net-programs",
    "share-of-the-population-with-access-to-electricity",
    "access-to-clean-fuels-and-technologies-for-cooking",
    "share-using-safely-managed-sanitation",
    "proportion-using-safely-managed-drinking-water",
    "number-injured-from-disasters",
    "number-homeless-from-natural-disasters",
    "total-affected-by-natural-disasters",
    "direct-disaster-economic-loss",
    "weather-losses-share-gdp",
    "disaster-risk-reduction-progress",
    "social-spending-oecd-longrun",
    "fish-species-threatened",
    "global-wild-fishery-catch-by-sector",
    "homicide-rate-by-age",
    "number-of-homicide-deaths",
    "homicide-deaths-by-age",
    "fatalities-from-terrorism",
    "death-rate-in-state-based-conflicts-by-conflict-type",
    "deaths-in-conflicts",
    "number-of-enrolled-children-in-pre-primary-education",
    "gender-gap-in-pre-primary-education",
    "school-life-expectancy-at-the-pre-primary-education-level",
    "school-life-expectancy-of-boys-and-girls-at-the-pre-primary-education-level",
    "population-breakdown-by-highest-level-of-education-achieved-for-those-aged-15-in",
    "out-of-school-children-of-primary-school-age-by-world-region",
    "literate-and-illiterate-world-population",
    "literacy-rates-of-the-the-younger-population-15-24-years-versus-literacy-rates-of-the-older-population-65",
    "pupil-teacher-ratio-for-primary-education-by-country",
    "number-of-teachers-across-education-levels",
    "urban-vs-rural-safely-managed-drinking-water-source",
    "drinking-water-services-coverage-urban",
    "drinking-water-services-coverage-rural",
    "population-using-at-least-basic-drinking-water",
    "safe-sanitation-without",
    "urban-vs-rural-population-safely-managed-sanitation",
    "sanitation-facilities-coverage-in-urban-areas",
    "sanitation-facilities-coverage-in-rural-areas",
    "proportion-with-basic-handwashing-facilities-urban-vs-rural",
    "water-withdrawals-per-capita",
    "renewable-water-resources-per-capita",
    "prevalence-of-undernourishment",
    "number-undernourished",
    "share-of-population-with-severe-food-insecurity",
    "number-of-severely-food-insecure-people-by-region",
    "prevalence-of-stunting-male-vs-female",
    "share-of-adults-defined-as-obese",
    "prevalence-of-anemia-in-pregnant-women",
    "prevalence-of-anemia-in-women-of-reproductive-age-aged-15-29",
    "prevalence-of-anemia-in-children",
]

const embeddedSdgChartsAsOf2023_04_10 = [
    "forest-area-as-share-of-land-area",
    "terrestrial-protected-areas",
    "protected-terrestrial-biodiversity-sites",
    "proportion-of-important-sites-for-freshwater-biodiversity-covered-by-protected-areas",
    "forest-area-net-change-rate",
    "above-ground-biomass-in-forest-per-hectare",
    "proportion-of-forest-area-within-legally-established-protected-areas",
    "proportion-of-forest-area-with-long-term-management-plan",
    "proportion-of-forest-area-certified-under-an-independently-verified-certification-scheme",
    "share-degraded-land",
    "coverage-by-protected-areas-of-important-sites-for-mountain-biodiversity",
    "mountain-green-cover-index",
    "red-list-index",
    "countries-to-access-and-benefit-sharing-clearing-house",
    "countries-to-the-international-treaty-on-plant-genetic-resources",
    "countries-that-are-parties-to-the-nagoya-protocol",
    "budget-to-manage-invasive-alien-species",
    "national-biodiversity-strategy-align-with-aichi-target-9",
    "national-progress-towards-aichi-biodiversity-target-2",
    "total-oda-for-biodiversity-by-recipient",
    "total-oda-for-biodiversity-by-donor",
    "total-oda-for-biodiversity-by-recipient",
    "total-oda-for-biodiversity-by-donor",
    "share-of-urban-population-living-in-slums",
    "expenditure-on-cultural-and-natural-heritage-per-capita",
    "deaths-and-missing-persons-due-to-natural-disasters",
    "internally-displaced-persons-from-disasters",
    "direct-disaster-loss-as-a-share-of-gdp",
    "global-disaster-losses-gdp-share",
    "economic-losses-from-disasters-share-gdp",
    "proportion-of-population-served-by-municipal-waste-collection",
    "PM25-air-pollution",
    "urban-policies-population-dynamics",
    "countries-with-legislative-regulatory-provisions-for-managing-disaster-risk",
    "local-govts-risk-reduction",
    "death-rates-from-disasters",
    "deaths-and-missing-persons-due-to-natural-disasters",
    "internally-displaced-persons-from-disasters",
    "countries-with-legislative-regulatory-provisions-for-managing-disaster-risk",
    "local-govts-risk-reduction",
    "number-of-parties-env-agreements",
    "mainstreaming-sustainable-development-into-teacher-education",
    "mainstreaming-sustainable-development-into-curricula",
    "mainstreaming-sustainable-development-into-student-assessment",
    "mainstreaming-sustainable-development-into-national-education-policies",
    "green-climate-gcf-fund-pledges",
    "countries-with-national-adaptation-plans-for-climate-change",
    "gdp-per-capita-growth",
    "growth-rate-of-real-gdp-per-employed-person",
    "informal-employment-of-total-non-agricultural-employment",
    "informal-employment-by-sex",
    "material-footprint-per-capita",
    "material-footprint-per-unit-of-gdp",
    "domestic-material-consumption-per-capita",
    "domestic-material-consumption-per-unit-of-gdp",
    "average-hourly-earnings",
    "hourly-earnings-male-vs-female",
    "unemployment-rate",
    "unemployment-rate-of-males-vs-females",
    "youth-not-in-education-employment-training",
    "children-aged-5-17-engaged-in-labor",
    "children-aged-5-17-years-engaged-in-labor",
    "non-fatal-occupational-injuries-per-100000",
    "fatal-occupational-injuries-among-employees",
    "level-of-national-compliance-with-labor-rights",
    "tourism-gdp-proportion-of-total-gdp",
    "number-of-commercial-bank-branches-per-100000-adults",
    "automated-teller-machines-atms-per-100000-adults",
    "account-at-financial-institution",
    "total-oda-for-aid-for-trade-by-recipient",
    "total-oda-for-aid-for-trade-by-donor",
    "national-strategy-for-youth-employment",
    "share-of-the-population-with-access-to-electricity",
    "access-to-clean-fuels-and-technologies-for-cooking",
    "share-of-final-energy-consumption-from-renewable-sources",
    "energy-intensity-of-economies",
    "international-finance-clean-energy",
    "renewable-electricity-generating-capacity-per-capita",
    "universal-suffrage-women-lied",
    "nondiscrimination-clause-gender",
    "law-mandate-nondiscrimination-hiring",
    "overarching-legal-frameworks-regarding-gender-equality",
    "legal-frameworks-regarding-violence-against-women",
    "gender-equality-in-employment-and-economic-benefits",
    "gender-equality-within-marriage-and-family",
    "women-who-experienced-violence-by-an-intimate-partner",
    "women-married-by-age-15",
    "women-married-by-age-18",
    "female-genital-mutilation-prevalence",
    "average-daily-time-spent-by-women-on-domestic-work-paid-and-unpaid",
    "time-spent-in-domestic-work-female-vs-male",
    "seats-held-by-women-in-national-parliaments",
    "share-of-women-in-ministerial-positions",
    "share-firms-top-female-manager",
    "proportion-of-women-in-senior-and-middle-management-positions",
    "women-informed-decisions-health-sexual-relations",
    "access-to-sexual-health-care-and-education",
    "land-ownership-men-vs-women",
    "gender-rights-to-property",
    "share-of-individuals-who-own-a-mobile-telephone-by-sex",
    "systems-track-gender-equality",
    "total-government-revenue-of-gdp",
    "proportion-of-domestic-budget-funded-by-domestic-taxes-of-gdp",
    "net-oda-as-percentage-of-oecd-donors-gni",
    "net-oda-to-ldcs-as-percentage-of-donors-gni",
    "foreign-direct-investment-net-outflows-of-gdp",
    "debt-service-of-exports-of-goods-services",
    "countries-with-a-signed-bilateral-investment-treaty",
    "countries-with-an-inforce-bilateral-investment-treaty",
    "broadband-penetration-by-country",
    "export-of-environmentally-sound-technologies",
    "share-of-individuals-using-the-internet",
    "net-official-development-assistance-and-aid-received",
    "tariff-rate-applied-weighted-mean-all-products",
    "exports-of-goods-and-services-constant-2010-us",
    "tariff-rates",
    "annual-inflation-of-consumer-prices",
    "gross-public-sector-debt-as-a-proportion-of-gdp",
    "various-sources-of-the-total-value-of-exports-as-a-share-of-gdp",
    "mechanisms-to-enhance-policy-for-sustainable-development",
    "use-of-crf-tools-by-providers-of-dev-cooperation",
    "providers-of-development-coordination",
    "recipients-of-development-coordination",
    "money-committed-to-public-private-partnerships-for-infrastructure",
    "statistical-capacity-indicator",
    "national-statistical-legislation",
    "countries-with-stats-plan-funded-by-source",
    "resources-statistical-capacity",
    "completeness-population-census",
    "share-of-births-registered",
    "share-of-deaths-registered",
    "maternal-mortality-ratio-sdgs",
    "births-attended-by-health-staff-sdgs",
    "child-mortality-rate-sdgs",
    "neonatal-mortality-rate-sdgs",
    "incidence-of-hiv-sdgs",
    "incidence-of-tuberculosis-sdgs",
    "incidence-of-malaria-sdgs",
    "prevalence-of-hepatitis-b-surface-antigen",
    "interventions-ntds-sdgs",
    "mortality-from-ncds-sdgs",
    "death-rate-from-suicides-ghe",
    "population-with-alcohol-use-disorders",
    "interventions-for-substance-use-disorders",
    "total-alcohol-consumption-per-capita-litres-of-pure-alcohol",
    "road-traffic-deaths-sdgs",
    "death-rate-road-traffic-injuries",
    "share-of-married-women-ages-15-49-years-whose-need-for-family-planning-is-satisfied",
    "adolescent-fertility-ihme",
    "adolescent-fertility-ihme-15-19",
    "universal-health-coverage-index",
    "large-household-expenditures-health",
    "death-rate-by-source-from-air-pollution",
    "death-rate-household-and-ambient-air-pollution",
    "death-rate-household-air-pollution",
    "death-rate-ambient-air-pollution",
    "deaths-attributed-to-household-air-pollution-vs-deaths-attributed-to-ambient-air-pollution",
    "mortality-rate-attributable-to-wash",
    "death-rate-from-poisonings",
    "prevalence-of-tobacco-use-sdgs",
    "share-of-children-vaccinated-with-mcv2",
    "coverage-of-pneumococcal-conjugate-vaccine",
    "share-of-children-immunized-dtp3",
    "coverage-of-the-human-papillomavirus-vaccine",
    "net-oda-to-medical-research",
    "share-of-health-facilities-with-essential-medicines",
    "physicians-per-1000-people",
    "ihr-core-capacity-index-sdgs",
    "annualized-average-growth-rate-in-per-capita-real-survey-mean-consumption-or-income-bottom-40-of-population",
    "share-of-population-living-on-less-than-half-of-the-median-income",
    "share-of-the-population-reporting-having-felt-discriminated-against",
    "labor-share-of-gdp",
    "regulation-financial-markets",
    "proportion-of-members-of-developing-countries-in-international-organizations",
    "facilitate-orderly-safe-migration",
    "deaths-and-disappearances-during-migration",
    "number-of-refugees-per-100000",
    "proportion-tariff-lines-applied-to-imports-from-ldcs",
    "total-assistance-for-development-by-recipient",
    "total-assistance-for-development-by-donor",
    "remittance-costs-as-share-of-amount-remitted",
    "share-of-rural-population-near-a-road",
    "air-passengers-carried",
    "railways-passengers-carried-passenger-km",
    "air-transport-freight-ton-km",
    "manufacturing-value-added-to-gdp",
    "industry-share-of-total-emplyoment",
    "manufacturing-share-of-total-employment",
    "small-scale-industries-share",
    "smalsmall-scale-industries-loan",
    "co2-intensity",
    "research-spending-gdp",
    "researchers-in-rd-per-million-people",
    "total-oda-for-infrastructure-by-recipient",
    "total-manufacturing-value-added-from-high-tech",
    "mobile-cellular-subscriptions-per-100-people",
    "share-of-individuals-using-the-internet",
    "share-of-population-in-extreme-poverty",
    "share-of-population-living-in-poverty-by-national-poverty-lines",
    "share-of-population-living-in-poverty-by-national-poverty-lines",
    "coverage-of-social-insurance-programs",
    "access-to-basic-resources",
    "legally-recognized-rights-to-land",
    "deaths-and-missing-persons-due-to-natural-disasters",
    "internally-displaced-persons-from-disasters",
    "direct-disaster-loss-as-a-share-of-gdp",
    "global-disaster-losses-gdp-share",
    "economic-losses-from-disasters-share-gdp",
    "legislative-provisions-for-managing-disaster-risk",
    "local-gov-disaster-strategies",
    "donated-official-development-assistance-grants-for-poverty-reduction",
    "received-official-development-assistance-grants-for-poverty-reduction",
    "health-expenditure-government-expenditure",
    "share-of-education-in-government-expenditure",
    "beach-litter",
    "chlorophyll-a-deviation-from-the-global-average",
    "countries-using-ecosystem-based-approaches-to-manage-marine-areas",
    "fish-stocks-within-sustainable-levels",
    "marine-protected-areas",
    "regulation-illegal-fishing",
    "sustainable-fisheries-as-a-proportion-of-gdp",
    "ocean-research-funding",
    "protection-of-the-rights-of-small-scale-fisheries",
    "ratification-and-accession-to-unclos",
    "implementation-of-unclos",
    "intentional-homicides-per-100000-people",
    "deaths-conflict-terrorism-per-100000",
    "total-conflict-related-civilian-deaths",
    "women-violence-by-an-intimate-partner",
    "population-subjected-to-physical-violence",
    "population-subjected-to-sexual-violence-male-vs-female",
    "safety-walking-alone",
    "violence-against-children",
    "victims-of-human-trafficking-under-18-male-vs-female",
    "human-trafficking-over-18-by-sex",
    "women-who-experienced-sexual-violence-by-age-18",
    "men-experienced-sexual-violence-by-age-18",
    "percentage-of-women-18-to-29-who-report-having-been-victims-of-forced-sex-as-children",
    "percentage-of-men-18-to-29-who-report-having-been-victims-of-forced-sex-as-children",
    "reported-crime-to-the-police",
    "unsentenced-detainees-as-proportion-of-prison-population",
    "share-of-small-with-illicit-origin",
    "bribery-prevalence-un",
    "bribery-incidence-of-firms-experiencing-at-least-one-bribe-payment-request",
    "govt-expenditure-share-budget",
    "representation-of-women-in-the-lower-chamber-of-parliament",
    "representation-of-women-in-the-upper-chamber-of-parliament",
    "proportion-of-members-of-developing-countries-in-international-organizations",
    "share-of-births-registered",
    "cases-of-killed-human-rights-defenders-journalists-trade-unionists",
    "countries-that-adopt-guarantees-for-public-access-to-information",
    "share-countries-accredited-independent-national-human-rights-institutions",
    "countries-with-independent-national-human-rights-institution",
    "share-of-the-population-reporting-having-felt-discriminated-against",
    "share-of-students-in-early-primary-education-achieving-minimum-reading-proficiency-2010-2015",
    "share-of-students-in-early-primary-education-achieving-minimum-math-proficiency-2010-2015",
    "share-of-students-at-end-of-primary-education-achieving-minimum-reading-proficiency-2010-2015",
    "share-of-students-at-end-of-primary-education-achieving-minimum-math-proficiency-2010-2015",
    "share-of-students-at-end-of-lower-secondary-education-achieving-minimum-reading-proficiency-2010-2015",
    "share-of-students-at-end-of-lower-secondary-education-achieving-minimum-math-proficiency-2010-2015",
    "proportion-of-children-developmentally-on-track",
    "net-enrollment-rate-pre-primary",
    "net-enrollment-pre-primary-boys-vs-girls",
    "gross-enrollment-ratio-in-tertiary-education",
    "proportion-with-ict-skills-in-presentations",
    "proportion-with-ict-skills-by-sex",
    "net-enrollment-rate-primary-gender-parity-index-gpi",
    "school-life-expectancy-primary-gender-parity-index-gpi",
    "primary-completion-rate-gender-parity-index",
    "school-life-expectancy-in-secondary-education-by-sex",
    "youth-literacy-males",
    "youth-literacy-female",
    "adult-literacy-male",
    "adult-literacy-female",
    "mainstreaming-sustainable-development-into-teacher-education",
    "mainstreaming-sustainable-development-into-curricula",
    "mainstreaming-sustainable-development-into-student-assessment",
    "mainstreaming-sustainable-development-into-national-education-policies",
    "schools-access-to-electricity",
    "schools-access-to-wash",
    "schools-access-drinking-water",
    "schools-access-computers",
    "primary-schools-with-access-to-internet",
    "share-of-schools-with-access-tosingle-sex-basic-sanitation",
    "schools-materials-students-with-disabilities",
    "oda-for-scholarships",
    "percentage-of-teachers-in-pre-primary-education-who-are-qualified",
    "share-of-primary-teachers-qualified",
    "percentage-of-teachers-in-lower-secondary-education-who-are-qualified",
    "percentage-of-teachers-in-upper-secondary-education-who-are-qualified",
    "country-scp-plan",
    "material-footprint-per-capita",
    "material-footprint-per-unit-of-gdp",
    "domestic-material-consumption-per-capita",
    "domestic-material-consumption-per-unit-of-gdp",
    "food-waste-per-capita",
    "parties-to-multilateral-agreements-on-hazardous-waste",
    "hazardous-waste-generated-per-capita",
    "treatment-of-hazardous-waste",
    "total-waste-generation",
    "municipal-waste-recycled",
    "electronic-waste-recycling-rate",
    "companies-publishing-sustainability-reports-minimum-requirements",
    "companies-publishing-sustainability-advanced-requirements",
    "medium-high-level-implementation-of-sustainable-public-procurement",
    "mainstreaming-sustainable-development-into-teacher-education",
    "mainstreaming-sustainable-development-into-curricula",
    "mainstreaming-sustainable-development-into-student-assessment",
    "mainstreaming-sustainable-development-into-national-education-policies",
    "renewable-electricity-generating-capacity-per-capita",
    "implementation-of-tools-to-monitor-economic-and-environmental-tourism",
    "fossil-fuel-subsidies-gdp",
    "fossil-fuel-subsidies-per-capita",
    "fossil-fuel-subsidies",
    "proportion-using-safely-managed-drinking-water",
    "share-of-population-using-safely-managed-drinking-water-services-rural-vs-urban",
    "share-using-safely-managed-sanitation",
    "proportion-of-population-with-basic-handwashing-facilities-on-premises",
    "wastewater-safely-treated",
    "water-bodies-good-water-quality",
    "water-productivity",
    "freshwater-withdrawals-as-a-share-of-internal-resources",
    "implementation-of-integrated-water-resource-management",
    "water-basins-cooperation-plan",
    "coverage-of-wetlands",
    "change-in-total-mangrove-area",
    "share-of-land-covered-by-lakes-and-rivers",
    "total-oda-for-water-supply-and-sanitation-by-recipient",
    "share-of-countries-with-procedures-for-community-participation-in-water-management",
    "prevalence-of-undernourishment",
    "share-of-population-with-moderate-or-severe-food-insecurity",
    "share-of-children-younger-than-5-who-suffer-from-stunting",
    "share-of-children-with-a-weight-too-low-for-their-height-wasting",
    "share-of-children-who-are-overweight",
    "agriculture-value-added-per-worker-wdi",
    "income-small-scale-food-producers",
    "income-of-large-scale-food-producers",
    "number-of-accessions-of-plant-genetic-resources-secured-in-conservation-facilities",
    "proportion-of-animal-breeds-genetic-conservation",
    "proportion-of-local-breeds-at-risk-of-extinction",
    "agriculture-orientation-index",
    "total-financial-assistance-and-flows-for-agriculture-by-recipient",
    "agricultural-export-subsidies",
    "domestic-food-price-volatility-index",
]
