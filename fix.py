
import re

with open('src/main.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

new_chart = '''
  <div style={{ height: '240px', width: '100%', marginTop: '20px' }}>
    <AreaChart
      data={[
        { key: 'Weight', data: sorted.length ? sorted.map(x => ({ key: new Date(x.d), data: x.w })) : [{key: new Date(), data: cur}] },
        { key: 'Goal', data: sorted.length ? sorted.map(x => ({ key: new Date(x.d), data: goal })) : [{key: new Date(), data: goal}] }
      ]}
      xAxis={
        <LinearXAxis
          type="time"
          tickSeries={
            <LinearXAxisTickSeries
              label={
                <LinearXAxisTickLabel
                  format={(v) => new Date(v).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  fill="var(--muted)"
                />
              }
              tickSize={10}
            />
          }
        />
      }
      yAxis={
        <LinearYAxis
          axisLine={None}
          tickSeries={<LinearYAxisTickSeries line={None} label={None} tickSize={10} />}
        />
      }
      series={
        <AreaSeries
          type="grouped"
          interpolation="smooth"
          area={
            <Area
              gradient={
                <Gradient
                  stops={[
                    <GradientStop key={1} stopOpacity={0} />,
                    <GradientStop key={2} offset="100%" stopOpacity={0.4} />
                  ]}
                />
              }
            />
          }
          colorScheme={['#22c55e', '#f59e0b']}
        />
      }
      gridlines={<GridlineSeries line={<Gridline strokeColor="var(--line)" />} />}
    />
  </div>
</section>
'''
new_chart = new_chart.replace('None', 'null')

code = re.sub(r'<svg viewBox="0 0 700 230".*?</section>', new_chart, code, flags=re.DOTALL)

with open('src/main.jsx', 'w', encoding='utf-8') as f:
    f.write(code)
print('Done!')

