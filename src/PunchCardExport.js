import React, { useRef } from "react";
import html2canvas from "html2canvas";
import skillData from "./skills.json";
import "./PunchCardExport.css";

export default function PunchCardExport({ unlockedTiers, skillPoints }) {
    const cardRef = useRef(null);

    const exportAsImage = () => {
        if (!cardRef.current) return;

        html2canvas(cardRef.current, { backgroundColor: "#fff" }).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "coach_skill_punch_card.png";
            link.click();
        });
    };

    // Group trees by type
    const treeGroups = {
        basic: [],
        advanced: [],
        crossover: [],
        elite: []
    };

    Object.keys(skillData).forEach(treeId => {
        const tree = skillData[treeId];
        treeGroups[tree.type].push({ id: treeId, data: tree });
    });

    return (
        <div className="punch-card-container">
            <div className="punch-card" ref={cardRef}>
                <h2>Coach Skill Tree Punch Card</h2>
                <h3>Available Skill Points: {skillPoints}</h3>

                <div className="tree-columns">
                    {Object.entries(treeGroups).map(([type, trees]) => (
                        <div key={type} className="tree-column">
                            <h3 className="column-title">{type.charAt(0).toUpperCase() + type.slice(1)} Trees</h3>
                            {trees.map(({ id, data }) => {
                                const treeData = unlockedTiers[id];

                                const totalTreeCost = data.categories.reduce((sum, category) => {
                                    return sum + category.skills.reduce((skillSum, skill) => skillSum + skill.cost, 0);
                                }, 0);

                                if (treeData === undefined || totalTreeCost === 0) {
                                    return null;
                                }

                                return (
                                    <div key={id} className="punch-card-row">
                                        <span className="tree-name">{id}:</span>
                                        <div className="tree-data">
                                            {data.categories.map((category, idx) => {
                                                if (treeData[idx] === undefined) {
                                                    return null;
                                                }
                                                return (
                                                    <p key={idx} className="category-data">
                                                        {category.name}: {treeData[idx] - 1}
                                                    </p>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <button onClick={exportAsImage} className="export-button">
                Download as PNG
            </button>
        </div>
    );
}
