import type { Metadata } from "next";

import { ContentPage } from "@/components/ContentPage";
import { StorePageShell } from "@/components/StorePageShell";

export const metadata: Metadata = {
  title: "Size guide — Mohrbaugh",
};

export default function SizeGuidePage() {
  return (
    <StorePageShell>
      <ContentPage
        title="Size guide"
        lede="Use these charts as a starting point. Fit may vary by style and fabric."
      >
        <div className="size-guide-scroll">
          <table className="size-guide-table">
            <caption>Men&apos;s tops (cm)</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Chest</th>
                <th scope="col">Waist</th>
                <th scope="col">Hip</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">S</th>
                <td>88–96</td>
                <td>74–82</td>
                <td>88–96</td>
              </tr>
              <tr>
                <th scope="row">M</th>
                <td>96–104</td>
                <td>82–90</td>
                <td>96–104</td>
              </tr>
              <tr>
                <th scope="row">L</th>
                <td>104–112</td>
                <td>90–98</td>
                <td>104–112</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="size-guide-scroll">
          <table className="size-guide-table">
            <caption>Women&apos;s bottoms (cm)</caption>
            <thead>
              <tr>
                <th scope="col">Size</th>
                <th scope="col">Waist</th>
                <th scope="col">Hip</th>
                <th scope="col">Inseam</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">S</th>
                <td>66–74</td>
                <td>88–96</td>
                <td>76</td>
              </tr>
              <tr>
                <th scope="row">M</th>
                <td>74–82</td>
                <td>96–104</td>
                <td>78</td>
              </tr>
              <tr>
                <th scope="row">L</th>
                <td>82–90</td>
                <td>104–112</td>
                <td>80</td>
              </tr>
            </tbody>
          </table>
        </div>
      </ContentPage>
    </StorePageShell>
  );
}
