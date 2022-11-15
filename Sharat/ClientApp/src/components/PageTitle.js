import React from 'react';

const PageTitle= ({title}) => {
    return (
		<div>
			<div className="dashboard-title-component">
				<h3 className="mb-3">{title}</h3>
			</div>
		</div>
    )
}
export default PageTitle